import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { adjustStockLevel } from "../services/inventoryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const createOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const toTrimmedString = (value, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

const normalizePaymentMethod = (paymentMethod) => {
  const normalized = toTrimmedString(paymentMethod).toLowerCase();
  return ["cash_on_delivery", "bank_transfer", "easypaisa", "jazzcash"].includes(
    normalized,
  )
    ? normalized
    : null;
};

const normalizeCustomer = (rawCustomer = {}, user = null) => {
  const fullName = toTrimmedString(rawCustomer.fullName, user?.name || "");
  const email = toTrimmedString(rawCustomer.email, user?.email || "").toLowerCase();
  const phone = toTrimmedString(rawCustomer.phone);

  if (!fullName || !email || !phone) {
    throw new ApiError(400, "Full name, email, and phone are required");
  }

  return { fullName, email, phone };
};

const normalizeShippingAddress = (rawAddress = {}) => {
  const shippingAddress = {
    addressLine1: toTrimmedString(rawAddress.addressLine1),
    addressLine2: toTrimmedString(rawAddress.addressLine2),
    city: toTrimmedString(rawAddress.city),
    state: toTrimmedString(rawAddress.state),
    postalCode: toTrimmedString(rawAddress.postalCode),
    country: toTrimmedString(rawAddress.country),
  };

  if (
    !shippingAddress.addressLine1 ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    throw new ApiError(400, "Complete shipping address is required");
  }

  return shippingAddress;
};

export const placeOrder = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const customer = normalizeCustomer(req.body.customer, req.user);
  const shippingAddress = normalizeShippingAddress(req.body.shippingAddress);
  const paymentMethod = normalizePaymentMethod(req.body.paymentMethod);
  const notes = toTrimmedString(req.body.notes);

  if (items.length === 0) {
    throw new ApiError(400, "Order must include at least one product");
  }

  if (!paymentMethod) {
    throw new ApiError(400, "A valid payment method is required");
  }

  const requestedIds = items.map((item) => item.productId);
  const products = await Product.find({
    _id: { $in: requestedIds },
    status: "active",
  });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));
  const orderNumber = createOrderNumber();

  const orderItems = items.map((item) => {
    const product = productMap.get(String(item.productId));
    const quantity = Number(item.quantity);

    if (!product) {
      throw new ApiError(404, "One or more products are unavailable");
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new ApiError(400, "Each order item requires a quantity greater than zero");
    }

    return {
      product: product._id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      image: product.images[0] || "",
      unitPrice: product.price,
      ptaStatus: product.ptaStatus,
      quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const grandTotal = subtotal;
  const appliedAdjustments = [];
  let soldCountApplied = false;

  try {
    for (const item of orderItems) {
      await adjustStockLevel({
        productId: item.product,
        action: "outward",
        quantity: item.quantity,
        reason: `Stock deducted for order ${orderNumber}`,
        referenceType: "order",
        referenceId: orderNumber,
        performedBy: req.user?._id ?? null,
      });

      appliedAdjustments.push(item);
    }

    await Product.bulkWrite(
      orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { soldCount: item.quantity } },
        },
      })),
    );
    soldCountApplied = true;

    const order = await Order.create({
      orderNumber,
      items: orderItems,
      subtotal,
      grandTotal,
      customer,
      shippingAddress,
      paymentMethod,
      notes,
      placedBy: req.user?._id ?? null,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (appliedAdjustments.length > 0) {
      await Promise.allSettled(
        appliedAdjustments.map((item) =>
          adjustStockLevel({
            productId: item.product,
            action: "inward",
            quantity: item.quantity,
            reason: `Rollback for failed order ${orderNumber}`,
            referenceType: "order",
            referenceId: `${orderNumber}-rollback`,
            performedBy: req.user?._id ?? null,
          }),
        ),
      );

      if (soldCountApplied) {
        await Product.bulkWrite(
          appliedAdjustments.map((item) => ({
            updateOne: {
              filter: { _id: item.product },
              update: { $inc: { soldCount: -item.quantity } },
            },
          })),
        );
      }
    }

    throw error;
  }
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.status && req.query.status !== "all") {
    filter.status = req.query.status;
  }

  if (req.query.paymentStatus && req.query.paymentStatus !== "all") {
    filter.paymentStatus = req.query.paymentStatus;
  }

  if (req.query.search) {
    const query = new RegExp(
      req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [
      { orderNumber: query },
      { "customer.fullName": query },
      { "customer.email": query },
      { "customer.phone": query },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("placedBy", "name email role"),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: skip + orders.length < total,
      hasPreviousPage: page > 1,
    },
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ placedBy: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    orders,
  });
});

export const updateOrderByAdmin = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const nextStatus = toTrimmedString(req.body.status).toLowerCase();
  const nextPaymentStatus = toTrimmedString(req.body.paymentStatus).toLowerCase();
  const trackingNumber = toTrimmedString(req.body.trackingNumber, order.trackingNumber);
  const notes = req.body.notes !== undefined ? toTrimmedString(req.body.notes) : order.notes;

  if (
    nextStatus &&
    ["pending", "processing", "shipped", "delivered", "cancelled"].includes(nextStatus)
  ) {
    order.status = nextStatus;
  }

  if (nextPaymentStatus && ["pending", "paid", "failed"].includes(nextPaymentStatus)) {
    order.paymentStatus = nextPaymentStatus;
  }

  order.trackingNumber = trackingNumber;
  order.notes = notes;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    order,
  });
});
