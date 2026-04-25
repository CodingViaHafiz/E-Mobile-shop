import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "new",
      index: true,
    },
    batteryHealth: {
      type: Number,
      min: [0, "Battery health cannot be below 0"],
      max: [100, "Battery health cannot exceed 100"],
      default: null,
      validate: {
        validator(value) {
          if (this.condition === "used") {
            return value !== null && value !== undefined;
          }

          return true;
        },
        message: "Battery health is required for used phones",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    ptaTax: {
      type: Number,
      default: 0,
      min: [0, "PTA tax cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, "Sold count cannot be negative"],
    },
    lastStockUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ brand: 1, category: 1, status: 1 });
productSchema.index({
  name: "text",
  brand: "text",
  model: "text",
  description: "text",
});

const Product = mongoose.model("Product", productSchema);

export default Product;
