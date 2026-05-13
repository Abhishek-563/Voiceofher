import Contact from "../models/Contact.js";

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

export const addContact = async (req, res) => {
  try {
    const { name, phone, email, relation } = req.body;

    if (!name || !phone || !email || !relation) {
      return res.status(400).json({
        message: "Name, phone, email and relation are required",
      });
    }

    const contact = await Contact.create({
      user: req.user._id,
      name,
      phone,
      email,
      relation,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add contact",
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};
