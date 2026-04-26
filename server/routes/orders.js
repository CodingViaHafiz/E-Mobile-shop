import express from "express";
import {
  getAdminOrders,
  getMyOrders,
  placeOrder,
  updateOrderByAdmin,
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminOrders);
router.get("/mine", protect, getMyOrders);
router.post("/", protect, placeOrder);
router.patch("/:id", protect, authorize("admin"), updateOrderByAdmin);

export default router;
