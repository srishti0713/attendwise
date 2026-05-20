import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        semesterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Semester",
            required: true,
        },
        subjectName: {
            type: String,
            required: true,
        },
        attendance: {
            type: [
                {
                    date: {
                        type: Date,
                        required: true,
                        unique: true,
                    },
                    status: {
                        type: String,
                        enum: ["attended", "missed", "off"],
                        required: true,
                    },
                },
            ],
            default: [],
        },

        totalClasses: {
            type: Number,
            default: 0,
        },
        attendedClasses: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

// Virtual: attendance %
subjectSchema.virtual("attendancePercentage").get(function () {
    if (this.totalClasses === 0) return 0;
    return (this.attendedClasses / this.totalClasses) * 100;
});

// Virtual: zone
subjectSchema.virtual("zone").get(function () {
    const percentage =
        this.totalClasses === 0
            ? 0
            : (this.attendedClasses / this.totalClasses) * 100;

    if (percentage >= 75) return "safe";
    if (percentage >= 50) return "moderate";
    return "danger";
});

// Include virtuals
subjectSchema.set("toJSON", { virtuals: true });
subjectSchema.set("toObject", { virtuals: true });

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
