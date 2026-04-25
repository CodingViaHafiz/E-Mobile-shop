import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["inward", "outward", "adjustment"],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
    },
    previousStock: {
      type: Number,
      required: true,
      min: [0, "Previous stock cannot be negative"],
    },
    newStock: {
      type: Number,
      required: true,
      min: [0, "New stock cannot be negative"],
    },
    reason: {
      type: String,
      default: "",
      trim: true,
    },
    referenceType: {
      type: String,
      enum: ["product_create", "bulk_upload", "manual", "order", "product_update"],
      default: "manual",
    },
    referenceId: {
      type: String,
      default: "",
      trim: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

inventoryLogSchema.index({ createdAt: -1, product: 1 });

const InventoryLog = mongoose.model("InventoryLog", inventoryLogSchema);

export default InventoryLog;
