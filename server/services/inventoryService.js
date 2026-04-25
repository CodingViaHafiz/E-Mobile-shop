import Product from "../models/Product.js";
import InventoryLog from "../models/InventoryLog.js";
import ApiError from "../utils/apiError.js";

const getReferenceId = (referenceId) =>
  referenceId === undefined || referenceId === null ? "" : String(referenceId);

export const createInventoryLog = async ({
  productId,
  type,
  quantity,
  previousStock,
  newStock,
  reason = "",
  referenceType = "manual",
  referenceId = "",
  performedBy = null,
}) =>
  InventoryLog.create({
    product: productId,
    type,
    quantity,
    previousStock,
    newStock,
    reason,
    referenceType,
    referenceId: getReferenceId(referenceId),
    performedBy,
  });

export const adjustStockLevel = async ({
  productId,
  action,
  quantity,
  targetStock,
  reason = "",
  referenceType = "manual",
  referenceId = "",
  performedBy = null,
}) => {
  if (!["inward", "outward", "set"].includes(action)) {
    throw new ApiError(400, "Stock action must be inward, outward, or set");
  }

  const normalizedQuantity = Number(quantity);
  const normalizedTarget = Number(targetStock);
  const timestamp = new Date();

  if (action === "set") {
    if (!Number.isFinite(normalizedTarget) || normalizedTarget < 0) {
      throw new ApiError(400, "Target stock must be a positive number or zero");
    }

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    const previousStock = existingProduct.stock;
    const nextStock = normalizedTarget;
    const delta = nextStock - previousStock;

    existingProduct.stock = nextStock;
    existingProduct.lastStockUpdatedAt = timestamp;
    await existingProduct.save();

    if (delta !== 0) {
      await createInventoryLog({
        productId: existingProduct._id,
        type: "adjustment",
        quantity: Math.abs(delta),
        previousStock,
        newStock: nextStock,
        reason,
        referenceType,
        referenceId,
        performedBy,
      });
    }

    return existingProduct;
  }

  if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  if (action === "inward") {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: normalizedQuantity },
        $set: { lastStockUpdatedAt: timestamp },
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    await createInventoryLog({
      productId: updatedProduct._id,
      type: "inward",
      quantity: normalizedQuantity,
      previousStock: updatedProduct.stock - normalizedQuantity,
      newStock: updatedProduct.stock,
      reason,
      referenceType,
      referenceId,
      performedBy,
    });

    return updatedProduct;
  }

  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: productId,
      stock: { $gte: normalizedQuantity },
    },
    {
      $inc: { stock: -normalizedQuantity },
      $set: { lastStockUpdatedAt: timestamp },
    },
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    const existingProduct = await Product.findById(productId).select("stock");

    if (!existingProduct) {
      throw new ApiError(404, "Product not found");
    }

    throw new ApiError(400, "Insufficient stock for this product");
  }

  await createInventoryLog({
    productId: updatedProduct._id,
    type: "outward",
    quantity: normalizedQuantity,
    previousStock: updatedProduct.stock + normalizedQuantity,
    newStock: updatedProduct.stock,
    reason,
    referenceType,
    referenceId,
    performedBy,
  });

  return updatedProduct;
};
