import express from "express";

import {
  sendSOS,
  getSOSHistory,
  resolveAlert,
} from "../controllers/sosController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendSOS);

router.get("/history", protect, getSOSHistory);

router.patch("/:id/resolve", protect, resolveAlert);

export default router;
