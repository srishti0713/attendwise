import mongoose, { Schema } from "mongoose";

const timetableSchema = new Schema({
    semesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true,
    },
    timetable: {
        Monday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        Tuesday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        Wednesday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        Thursday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        Friday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
        Saturday: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Subject",
            },
        ],
    },
});

const Timetable = mongoose.model("Timetable", timetableSchema);
export default Timetable;
