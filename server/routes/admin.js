import express from "express";
import {
  getDashboardData,
  updateUser,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardData);
router.patch("/users/:id", updateUser);

export default router;
