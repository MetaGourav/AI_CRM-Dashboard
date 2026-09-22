import mongoose from 'mongoose';

export const TASK_STATUSES = ["Pending","In Progress","Completed"];
export const TASK_PRIORITIES = ["Low","Medium","High"];

const taskSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim:true,
        },
        description: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: TASK_STATUSES,
            default: "Pending",
            index: true,
        },
        priority: {
            type: String,
            enum: TASK_PRIORITIES,
            default: "Medium",
        },
        dueDate: {
            type: Date,
            default: null,
        },
        relatedLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            default: null,
        },
        relatedContact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact", 
            default: null,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model('Task', taskSchema);