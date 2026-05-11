import axios from "axios";
import SOSAlert from "../models/SOSAlert.js";
import User from "../models/User.js";

export const sendSOS = async (req, res) => {
  try {
    const { location, triggeredBy } = req.body;

    const user = await User.findById(req.user._id);
    const contacts = user.emergencyContacts;

    // Save SOS alert to database
    const alert = await SOSAlert.create({
      user: req.user._id,
      location,
      status: "ACTIVE",
      contactsNotified: contacts.map((c) => ({
        name: c.name,
        phone: c.phone,
      })),
      triggeredBy: triggeredBy || "BUTTON",
    });

    const message = `
🚨 EMERGENCY ALERT 🚨

Voice of Her SOS Activated by ${user.name}.

Live Location:
https://maps.google.com/?q=${location.lat},${location.lng}

Please respond immediately.
`;

    // Send SMS to each contact (if API key configured)
    if (
      process.env.FAST2SMS_API_KEY &&
      process.env.FAST2SMS_API_KEY !== "YOUR_API_KEY"
    ) {
      for (const contact of contacts) {
        try {
          await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            {
              route: "v3",
              sender_id: "TXTIND",
              message,
              language: "english",
              numbers: [contact.phone],
            },
            {
              headers: {
                authorization: process.env.FAST2SMS_API_KEY,
              },
            }
          );
        } catch (smsError) {
          console.error(
            `Failed to send SMS to ${contact.phone}:`,
            smsError.message
          );
        }
      }
    }

    // Emit real-time socket event
    const io = req.app.get("io");
    io.emit("newSOS", {
      _id: alert._id,
      user: {
        _id: user._id,
        name: user.name,
      },
      location: alert.location,
      status: alert.status,
      triggeredBy: alert.triggeredBy,
      contactsNotified: alert.contactsNotified,
      createdAt: alert.createdAt,
    });

    res.status(200).json({
      success: true,
      message: "SOS sent successfully",
      alert,
    });
  } catch (error) {
    console.error("SOS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send SOS",
    });
  }
};

export const getSOSHistory = async (req, res) => {
  try {
    const alerts = await SOSAlert.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(alerts);
  } catch (error) {
    console.error("Get SOS history error:", error);
    res.status(500).json({ message: "Failed to fetch SOS history" });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const alert = await SOSAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    alert.status = "RESOLVED";
    alert.resolvedAt = new Date();
    await alert.save();

    const io = req.app.get("io");
    io.emit("sosResolved", { _id: alert._id });

    res.json(alert);
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ message: "Failed to resolve alert" });
  }
};
