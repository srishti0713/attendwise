import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
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
            trim: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
    },
    { timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
