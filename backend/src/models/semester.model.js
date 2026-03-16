import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        semesterName: {
            type: String,
            required: true,
        },
        subjects: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
    },
    { timestamps: true },
);

export const Semester = mongoose.model("Semester", semesterSchema);
