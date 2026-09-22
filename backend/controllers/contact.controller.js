import Contact from "../models/Contact.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getContacts = asyncHandler(async (req, res) => {
    const { search,tag } = req.query;
    const filter = { owner: req.user._id };

    if (search) {
        const rx = new RegExp(search, 'i'); 
        filter.$or = [
            { name: rx },
            { email: rx },
            { phone: rx }
        ];
    }

    if (tag) {
        filter.tags = tag;
    }

    const contacts = await Contact.find(filter).sort({ favorite: -1, name: -1 });
    res.json({
        success: true,
        count: contacts.length,
        contacts
    });
});

export const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findOne({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
        throw new ApiError(404, "Contact not found");
    }
    res.json({
        success: true,
        contact
    });
});

export const createContact = asyncHandler(async (req, res) => {
    const contact = await Contact.create({ ...req.body, owner: req.user._id });
    res.status(201).json({
        success: true,
        contact
    });
});

export const updateContact = asyncHandler(async (req, res) => {
    const { owner, ...updates } = req.body;
    const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true }
    );
    if (!contact) {
        throw new ApiError(404, "Contact not found");
    }
    res.json({
        success: true,
        contact
    });
});

export const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!contact) {
        throw new ApiError(404, "Contact not found");
    }
    res.json({
        success: true,
        message: "Contact deleted successfully"
    });
});
