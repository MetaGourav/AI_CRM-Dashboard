import  Lead  from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getLeads = asyncHandler(async (req, res) => {
    const { status , priority , source,search } = req.query;

    const filter = { owner: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (source) filter.source = source;
    if (search) {
        const rx = new RegExp(search, 'i'); 
        filter.$or = [
            { name: rx },
            { email: rx },
            { company: rx },
        ];
    }

    const leads = await Lead.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
        success: true,
        count: leads.length,
        leads,
        data: leads
    });
});
export const getLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    res.status(200).json({
        success: true,
        lead
    });
});

export const createLead = asyncHandler(async (req, res) => {
    const lead = await Lead.create({ ...req.body, owner: req.user._id });
    res.status(201).json({
        success: true,
        lead
    });
});

export const updateLead = asyncHandler(async (req, res) => {
    const { owner, ...updates } = req.body; 

    const lead = await Lead.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true ,runValidators: true}
    );
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    res.status(200).json({
        success: true,
        lead
    });
});

export const deleteLead = asyncHandler(async (req, res) => {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    res.status(200).json({
        success: true,
        message: "Lead deleted successfully"
    });
});

export const reorderLeads = asyncHandler(async (req, res) => {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
        throw new ApiError(400, "Updates should be an array of lead updates");
    }
    await Promise.all(updates.map(async (update) => {
        const { id, order } = update;
        await Lead.updateOne(
            { _id: id, owner: req.user._id },
            { order }
        );
    }));
    res.json({
        success: true,
        message: "Pipline updated successfully"
    });
});
