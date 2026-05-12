import express from "express";

import {
  sendSOS,
  getSOSHistory,
} from "../controllers/sosController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", sendSOS);
router.get("/history", protect, getSOSHistory);

export default router;
