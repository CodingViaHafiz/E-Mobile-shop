import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// Password reset request routes removed
router.get("/me", protect, getCurrentUser);
router.post("/logout", logout);

export default router;
