import express from "express";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactMessage,
} from "../controllers/contactMessageController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/admin", protect, authorize("admin"), getContactMessages);
router.patch("/:id", protect, authorize("admin"), updateContactMessage);
router.delete("/:id", protect, authorize("admin"), deleteContactMessage);

export default router;
