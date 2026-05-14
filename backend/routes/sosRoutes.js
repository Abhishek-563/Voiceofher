import express from "express";

import {
  sendSOS,
  getSOSHistory,
  updateSOSStatus,
  updateSOSEvidence,
  deleteSOSAlert,
  clearAllSOSAlerts,
  deleteResolvedSOSAlerts,
} from "../controllers/sosController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", protect, sendSOS);

router.get("/history", protect, getSOSHistory);

router.patch("/:id/status", protect, updateSOSStatus);

router.patch("/:id/evidence", protect, updateSOSEvidence);

router.delete("/clear-all", protect, clearAllSOSAlerts);

router.delete("/resolved", protect, deleteResolvedSOSAlerts);

router.delete("/:id", protect, deleteSOSAlert);

export default router;
