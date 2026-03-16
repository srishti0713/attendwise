import mongoose from "mongoose";

const subjectSchema = new mongoose({
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    totalClasses: {
        type: Number,
        default: 0,
    },
    attendedClasses: {
        type: Number,
        default: 0,
    },
    attendancePercentage: {
        type: Number,
        default: 0,
    },
    zone: {
        type: String,
        enum: ["safe", "moderate", "danger"],
    },
});

export const Subject = mongoose.model("Subject", subjectSchema);
