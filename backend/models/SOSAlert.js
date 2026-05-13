import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      default: "Unknown User",
    },

    email: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      default: "Location address not available",
    },

    evidenceUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Resolved"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const SOSAlert = mongoose.model("SOSAlert", sosAlertSchema);

export default SOSAlert;
