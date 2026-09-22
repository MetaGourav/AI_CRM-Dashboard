import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getTasks = asyncHandler(async (req, res) => {
    const { status, priority, relatedLead } = req.query;

    const filter = { owner: req.user._id };

    if (relatedLead) filter.relatedLead = relatedLead;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
        .sort({ status: 1, dueDate: 1, createdAt: -1 })
        .populate("relatedLead", "name company")
        .populate("relatedContact", "name company");

    res.json({ success: true, count: tasks.length, tasks });
});

export const createTask = asyncHandler(async (req, res) => {
    const task = await Task.create({
        owner: req.user._id,
        ...req.body,
    });

    res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
    const { owner, ...updates } = req.body;

    if (updates.status) {
        if (updates.status.toLowerCase() === "completed") {
            updates.status = "Completed";
            if (!updates.completedAt) {
                updates.completedAt = new Date();
            }
        } else {
            updates.completedAt = null;
        }
    }
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        updates,
        { new: true, runValidators: true }
    );

    if(!task) throw new ApiError(404,"Task not found");
    res.json({success:true,task});
});

export const deleteTask = asyncHandler(async(req,res)=>{
    const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if(!task) throw new ApiError(404,"Task not found");
    res.json({success:true,message:"Task deleted successfully"});
});