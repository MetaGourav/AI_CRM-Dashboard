import mangoose from 'mongoose';

export const LEAD_STATUSES = ["New","Qualified","Lost","Won","Proposal"];
export const LEAD_PRIORITIES = ["Low","Medium","High"];

const leadSchema = mangoose.Schema(
    {
        owner: {
            type: mangoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Lead name is required'],
            trim:true,
        },
        email: {
            type: String,
            lowercase: true,
            trim:true,
            default: "",
        },
        phone: {
            type: String,
            trim:true,
            default: "",
        },
        company: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: LEAD_STATUSES,
            default: "New",
            index: true,
        },
        priority: {
            type: String,
            enum: LEAD_PRIORITIES,
            default: "Medium",
        },
        source: {
            type: String,
            enum: ["Website","Referral","Social Media","Advertisement","Other"],
            default: "Other",
        },
        value: {
            type: Number,
            default: 0,
            min: [0, 'Value cannot be negative'],
        },
        notes: {
            type: String,
            default: "",
        },
        tags: [{
            type: String,
            trim: true,
        }],
        aisummary: {
            type: String,
            default: "",
        },
        aiRiskScore: {
            type: Number,
            default: null,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export default mangoose.model('Lead', leadSchema);