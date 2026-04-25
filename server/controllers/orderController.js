import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { adjustStockLevel } from "../services/inventoryService.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const createOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

export const placeOrder = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (items.length === 0) {
    throw new ApiError(400, "Order must include at least one product");
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
      ptaTax: product.ptaTax,
      quantity,
    };
  });

  const subtotal = orderItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const totalPtaTax = orderItems.reduce(
    (total, item) => total + item.ptaTax * item.quantity,
    0,
  );
  const grandTotal = subtotal + totalPtaTax;
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
      totalPtaTax,
      grandTotal,
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
