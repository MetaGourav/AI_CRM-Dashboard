import mongoose from 'mongoose';

const contactSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Contact name is required'],
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
        title: {
            type: String,
            trim: true,
            default: "",
        },
        tags: [{
            type: String,
            trim: true,
        }],
        notes: {
            type: String,
            default: "",
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

contactSchema.index({ owner: 1, email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true, $ne: "" } } });

export const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
        