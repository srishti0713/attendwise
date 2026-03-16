import mongoose from "mongoose";

const assignmentSchema = new mongoose({
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: String,
        required: true,
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);
