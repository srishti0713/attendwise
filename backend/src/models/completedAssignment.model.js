import mongoose, { Schema } from "mongoose";

const completedAssignmentSchema = new Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
            index: true,
        },
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
            index: true,
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
        completedOn: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

const CompletedAssignment = mongoose.model(
    "CompletedAssignment",
    completedAssignmentSchema,
);
export default CompletedAssignment;
