import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        semesters: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Semester",
            },
        ],
        safePercentage: {
            type: Number,
            default: 60,
            min: 1,
            max: 100,
        },
        targetPercentage: {
            type: Number,
            default: 75,
            min: 1,
            max: 100,
        },
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
