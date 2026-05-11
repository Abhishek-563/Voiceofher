import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "RESOLVED", "CANCELLED"],
      default: "ACTIVE",
    },
    contactsNotified: [
      {
        name: String,
        phone: String,
      },
    ],
    triggeredBy: {
      type: String,
      enum: ["BUTTON", "VOICE", "AUTO"],
      default: "BUTTON",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const SOSAlert = mongoose.model("SOSAlert", sosAlertSchema);

export default SOSAlert;
