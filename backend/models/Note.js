import mongoose from 'mongoose';


const noteSchema = mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Note content is required'],
            trim: true,
        },
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            default: null,
        },
        contact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact",
            default: null,
        },
        pinned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);
export default Note;