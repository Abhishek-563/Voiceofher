import User from "../models/User.js";

export const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.emergencyContacts);
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

export const addContact = async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required" });
    }

    const user = await User.findById(req.user._id);

    user.emergencyContacts.push({
      name,
      phone,
      relationship: relationship || "Other",
    });

    await user.save();

    res.status(201).json(user.emergencyContacts);
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ message: "Failed to add contact" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.emergencyContacts = user.emergencyContacts.filter(
      (c) => c._id.toString() !== req.params.id
    );

    await user.save();

    res.json(user.emergencyContacts);
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ message: "Failed to delete contact" });
  }
};
