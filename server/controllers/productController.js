import mongoose from "mongoose";
import InventoryLog from "../models/InventoryLog.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { adjustStockLevel, createInventoryLog } from "../services/inventoryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { parseCsv } from "../utils/csvParser.js";

const toTrimmedString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const toNumberWithFallback = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
};

const normalizeImages = (images) => {
  if (Array.isArray(images)) {
    return images
      .map((image) => (typeof image === "string" ? image.trim() : ""))
      .filter(Boolean);
  }

  if (typeof images === "string") {
    return images
      .split(/[\n,]+/)
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeStatus = (status) => {
  const normalized = toTrimmedString(status, "").toLowerCase();
  return normalized === "inactive" ? "inactive" : "active";
};

const normalizePtaStatus = (ptaStatus) => {
  const normalized = toTrimmedString(ptaStatus, "no").toLowerCase();
  return normalized === "yes" ? "yes" : "no";
};

const normalizeCondition = (condition) => {
  const normalized = toTrimmedString(condition, "new").toLowerCase();

  if (["new", "used", "refurbished"].includes(normalized)) {
    return normalized;
  }

  return "new";
};

const normalizeProductInput = (rawProduct = {}, options = {}) => {
  const {
    includeStock = true,
    createdBy = null,
    updatedBy = null,
  } = options;
  const condition = normalizeCondition(rawProduct.condition);
  const batteryHealth = toNullableNumber(rawProduct.batteryHealth);
  const normalizedProduct = {
    name: toTrimmedString(rawProduct.name),
    brand: toTrimmedString(rawProduct.brand),
    model: toTrimmedString(rawProduct.model),
    price: toNumberWithFallback(rawProduct.price, 0),
    category: toTrimmedString(rawProduct.category),
    condition,
    batteryHealth:
      condition === "used" || condition === "refurbished" ? batteryHealth : null,
    description: toTrimmedString(rawProduct.description),
    ptaStatus: normalizePtaStatus(rawProduct.ptaStatus),
    images: normalizeImages(rawProduct.images),
    status: normalizeStatus(rawProduct.status),
    lowStockThreshold: Math.max(
      0,
      toNumberWithFallback(rawProduct.lowStockThreshold, 5),
    ),
    updatedBy,
  };

  if (createdBy) {
    normalizedProduct.createdBy = createdBy;
  }

  if (includeStock) {
    normalizedProduct.stock = Math.max(
      0,
      toNumberWithFallback(rawProduct.stock ?? rawProduct.initialStock, 0),
    );
    normalizedProduct.lastStockUpdatedAt = new Date();
  }

  return normalizedProduct;
};

const buildSearchFilter = (queryText) => {
  const search = toTrimmedString(queryText);

  if (!search) {
    return null;
  }

  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  return {
    $or: [
      { name: regex },
      { brand: regex },
      { model: regex },
      { category: regex },
      { description: regex },
    ],
  };
};

const mergeExpr = (existingExpr, nextExpr) => {
  if (!existingExpr) {
    return nextExpr;
  }

  return { $and: [existingExpr, nextExpr] };
};

const parseBulkProducts = (reqBody) => {
  if (Array.isArray(reqBody.products)) {
    return reqBody.products;
  }

  if (typeof reqBody.payload === "string" && reqBody.payload.trim()) {
    const format = toTrimmedString(reqBody.format, "json").toLowerCase();

    if (format === "csv") {
      return parseCsv(reqBody.payload);
    }

    try {
      const parsedJson = JSON.parse(reqBody.payload);
      return Array.isArray(parsedJson) ? parsedJson : [];
    } catch {
      throw new ApiError(400, "Invalid JSON payload for bulk upload");
    }
  }

  return [];
};

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 12));

  return { page, limit, skip: (page - 1) * limit };
};

const buildProductQuery = (req) => {
  const isAdmin = req.user?.role === "admin";
  const filter = {};
  const searchFilter = buildSearchFilter(req.query.search);
  const exprFilters = [];

  if (!isAdmin) {
    filter.status = "active";
  } else if (req.query.status && req.query.status !== "all") {
    filter.status = req.query.status;
  }

  if (req.query.brand && req.query.brand !== "all") {
    filter.brand = new RegExp(`^${req.query.brand.trim()}$`, "i");
  }

  if (req.query.category && req.query.category !== "all") {
    filter.category = new RegExp(`^${req.query.category.trim()}$`, "i");
  }

  if (req.query.condition && req.query.condition !== "all") {
    filter.condition = req.query.condition;
  }

  const minPrice = toNullableNumber(req.query.minPrice);
  const maxPrice = toNullableNumber(req.query.maxPrice);

  if (minPrice !== null || maxPrice !== null) {
    filter.price = {};

    if (minPrice !== null) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice !== null) {
      filter.price.$lte = maxPrice;
    }
  }

  if (req.query.stockStatus === "out") {
    filter.stock = 0;
  }

  if (req.query.stockStatus === "in") {
    filter.stock = { $gt: 0 };
  }

  if (req.query.stockStatus === "low") {
    exprFilters.push({
      $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }],
    });
  }

  if (searchFilter) {
    Object.assign(filter, searchFilter);
  }

  if (exprFilters.length > 0) {
    filter.$expr = exprFilters.reduce((expression, nextExpr) =>
      mergeExpr(expression, nextExpr),
    null);
  }

  return filter;
};

const getSortOptions = (query = {}) => {
  const allowedSortFields = new Set([
    "name",
    "price",
    "stock",
    "createdAt",
    "updatedAt",
    "brand",
    "soldCount",
  ]);
  const sortBy = allowedSortFields.has(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  return { [sortBy]: sortOrder };
};

export const createProduct = asyncHandler(async (req, res) => {
  const productPayload = normalizeProductInput(req.body, {
    includeStock: true,
    createdBy: req.user?._id,
    updatedBy: req.user?._id,
  });

  const product = await Product.create(productPayload);

  if (product.stock > 0) {
    await createInventoryLog({
      productId: product._id,
      type: "inward",
      quantity: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reason: "Initial stock on product creation",
      referenceType: "product_create",
      referenceId: product._id,
      performedBy: req.user?._id ?? null,
    });
  }

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const bulkCreateProducts = asyncHandler(async (req, res) => {
  const rawProducts = parseBulkProducts(req.body);

  if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
    throw new ApiError(400, "Bulk upload requires at least one product");
  }

  const productsPayload = rawProducts.map((entry) =>
    normalizeProductInput(entry, {
      includeStock: true,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    }),
  );

  const insertedProducts = await Product.insertMany(productsPayload, {
    ordered: true,
  });

  const logsToInsert = insertedProducts
    .filter((product) => product.stock > 0)
    .map((product) => ({
      product: product._id,
      type: "inward",
      quantity: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reason: "Initial stock from bulk upload",
      referenceType: "bulk_upload",
      referenceId: product._id.toString(),
      performedBy: req.user?._id ?? null,
    }));

  if (logsToInsert.length > 0) {
    await InventoryLog.insertMany(logsToInsert);
  }

  res.status(201).json({
    success: true,
    message: `${insertedProducts.length} products uploaded successfully`,
    products: insertedProducts,
    createdCount: insertedProducts.length,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = buildProductQuery(req);
  const sort = getSortOptions(req.query);

  const [products, total, brands, categories] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
    Product.distinct("brand", req.user?.role === "admin" ? {} : { status: "active" }),
    Product.distinct(
      "category",
      req.user?.role === "admin" ? {} : { status: "active" },
    ),
  ]);

  res.status(200).json({
    success: true,
    products,
    filters: {
      brands: brands.sort(),
      categories: categories.sort(),
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + products.length < total,
      hasPreviousPage: page > 1,
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const isAdmin = req.user?.role === "admin";

  if (!isAdmin && product.status !== "active") {
    throw new ApiError(404, "Product not found");
  }

  let reviewPermissions = {
    canReview: false,
    hasPurchased: false,
    hasReviewed: false,
  };

  if (req.user) {
    const hasPurchased = Boolean(
      await Order.exists({
        placedBy: req.user._id,
        status: { $in: ["pending", "processing", "shipped", "delivered"] },
        "items.product": product._id,
      }),
    );
    const hasReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString(),
    );

    reviewPermissions = {
      canReview: hasPurchased && !hasReviewed,
      hasPurchased,
      hasReviewed,
    };
  }

  res.status(200).json({
    success: true,
    product,
    reviewPermissions,
  });
});

export const createProductReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.status !== "active") {
    throw new ApiError(404, "Product not found");
  }

  const hasPurchased = Boolean(
    await Order.exists({
      placedBy: req.user._id,
      status: { $in: ["pending", "processing", "shipped", "delivered"] },
      "items.product": product._id,
    }),
  );

  if (!hasPurchased) {
    throw new ApiError(403, "Only customers who purchased this product can review it");
  }

  const hasReviewed = product.reviews.some(
    (review) => review.user.toString() === req.user._id.toString(),
  );

  if (hasReviewed) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const rating = Math.min(5, Math.max(1, Number(req.body.rating)));
  const comment = toTrimmedString(req.body.comment);

  if (!comment) {
    throw new ApiError(400, "Review comment is required");
  }

  product.reviews.unshift({
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });

  product.reviewCount = product.reviews.length;
  product.averageRating = product.reviews.length
    ? Number(
        (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1),
      )
    : 0;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    product,
    reviewPermissions: {
      canReview: false,
      hasPurchased: true,
      hasReviewed: true,
    },
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  const nextStock =
    req.body.stock !== undefined && req.body.stock !== null
      ? Math.max(0, toNumberWithFallback(req.body.stock, existingProduct.stock))
      : undefined;
  const updates = normalizeProductInput(req.body, {
    includeStock: false,
    updatedBy: req.user?._id,
  });

  existingProduct.set(updates);
  await existingProduct.save();

  let finalProduct = existingProduct;

  if (nextStock !== undefined && nextStock !== existingProduct.stock) {
    finalProduct = await adjustStockLevel({
      productId: existingProduct._id,
      action: "set",
      targetStock: nextStock,
      reason: "Stock updated while editing product",
      referenceType: "product_update",
      referenceId: existingProduct._id,
      performedBy: req.user?._id ?? null,
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: finalProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const updateProductStock = asyncHandler(async (req, res) => {
  const updatedProduct = await adjustStockLevel({
    productId: req.params.id,
    action: req.body.action,
    quantity: req.body.quantity,
    targetStock: req.body.targetStock,
    reason: toTrimmedString(req.body.reason),
    referenceType: "manual",
    referenceId: req.params.id,
    performedBy: req.user?._id ?? null,
  });

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    product: updatedProduct,
  });
});

export const getInventorySummary = asyncHandler(async (req, res) => {
  const lowStockExpr = {
    $expr: {
      $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockThreshold"] }],
    },
  };

  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    outOfStockCount,
    lowStockCount,
    aggregateTotals,
    lowStockProducts,
    recentLogs,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "inactive" }),
    Product.countDocuments({ stock: 0 }),
    Product.countDocuments(lowStockExpr),
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$stock" },
          stockValue: { $sum: { $multiply: ["$stock", "$price"] } },
        },
      },
    ]),
    Product.find(lowStockExpr)
      .sort({ stock: 1, updatedAt: -1 })
      .limit(5)
      .select("name brand model stock lowStockThreshold status"),
    InventoryLog.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("product", "name brand model")
      .populate("performedBy", "name email role"),
  ]);

  const totals = aggregateTotals[0] || { totalUnits: 0, stockValue: 0 };

  res.status(200).json({
    success: true,
    stats: {
      totalProducts,
      activeProducts,
      inactiveProducts,
      totalUnits: totals.totalUnits,
      stockValue: totals.stockValue,
      outOfStockCount,
      lowStockCount,
    },
    lowStockProducts,
    recentLogs,
  });
});

export const getInventoryLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};

  if (req.query.type && req.query.type !== "all") {
    filter.type = req.query.type;
  }

  if (req.query.productId && mongoose.Types.ObjectId.isValid(req.query.productId)) {
    filter.product = req.query.productId;
  }

  const [logs, total] = await Promise.all([
    InventoryLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("product", "name brand model")
      .populate("performedBy", "name email role"),
    InventoryLog.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + logs.length < total,
      hasPreviousPage: page > 1,
    },
  });
});

export const getInventoryAnalytics = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [topSellingProducts, lowStockByCategory, stockMovementTrend, recentOrders] =
    await Promise.all([
      Product.find({})
        .sort({ soldCount: -1, updatedAt: -1 })
        .limit(5)
        .select("name brand model soldCount stock price"),
      Product.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$stock", 0] },
                { $lte: ["$stock", "$lowStockThreshold"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
      ]),
      InventoryLog.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                },
              },
              type: "$type",
            },
            quantity: { $sum: "$quantity" },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]),
      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber grandTotal status createdAt items"),
    ]);

  res.status(200).json({
    success: true,
    topSellingProducts,
    lowStockByCategory,
    stockMovementTrend,
    recentOrders,
  });
});
