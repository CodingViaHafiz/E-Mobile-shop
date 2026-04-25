import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { optionalProtect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalProtect, placeOrder);

export default router;
