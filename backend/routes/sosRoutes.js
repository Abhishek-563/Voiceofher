import express from "express";

import {
  sendSOS,
  getSOSHistory,
  updateSOSStatus,
  updateSOSEvidence,
} from "../controllers/sosController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendSOS);

router.get("/history", protect, getSOSHistory);

router.patch("/:id/status", protect, updateSOSStatus);

router.patch("/:id/evidence", protect, updateSOSEvidence);

export default router;
