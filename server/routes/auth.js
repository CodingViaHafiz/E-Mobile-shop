import express from "express";
import {
  register,
  login,
  getCurrentUser,
  createPasswordResetRequest,
  getPasswordResetRequests,
  logout,
  updatePasswordResetRequest,
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/password-reset-requests", createPasswordResetRequest);
router.get(
  "/admin/password-reset-requests",
  protect,
  authorize("admin"),
  getPasswordResetRequests,
);
router.patch(
  "/admin/password-reset-requests/:id",
  protect,
  authorize("admin"),
  updatePasswordResetRequest,
);
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);

export default router;
