import express from "express";
import {
  bulkCreateProducts,
  createProduct,
  deleteProduct,
  getInventoryAnalytics,
  getInventoryLogs,
  getInventorySummary,
  getProductById,
  getProducts,
  createProductReview,
  updateProduct,
  updateProductStock,
} from "../controllers/productController.js";
import { authorize, optionalProtect, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", optionalProtect, getProducts);
router.get("/admin/summary", protect, authorize("admin"), getInventorySummary);
router.get("/admin/logs", protect, authorize("admin"), getInventoryLogs);
router.get("/admin/analytics", protect, authorize("admin"), getInventoryAnalytics);
router.post("/", protect, authorize("admin"), createProduct);
router.post("/bulk", protect, authorize("admin"), bulkCreateProducts);
router.post("/:id/reviews", protect, createProductReview);
router.patch("/stock/:id", protect, authorize("admin"), updateProductStock);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.get("/:id", optionalProtect, getProductById);

export default router;
