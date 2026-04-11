import mongoose, { Schema } from "mongoose";

const semesterSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        semesterName: {
            type: String,
            required: true,
            trim: true,
        },
        subjects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        isCurrent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

const Semester = mongoose.model("Semester", semesterSchema);
export default Semester;
