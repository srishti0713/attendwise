import Timetable from "../models/timetable.model.js";
import Semester from "../models/semester.model.js";
import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { throwError } from "../lib/api.error.js";
import { getAttendanceStats } from "../utils/attendance.util.js";

export const postTimetable = async (req, res) => {
    try {
        const { semesterId } = req.params;
        let { timetable } = req.body;
        const userId = req.user._id;

        // Validate semesterId
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "Invalid semester ID" });
        }

        // Check semester ownership
        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        });

        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        // Normalize timetable (handles OCR / partial input)
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const normalizedTimetable = {};

        for (const day of days) {
            normalizedTimetable[day] = Array.isArray(timetable?.[day])
                ? timetable[day]
                : [];
        }

        // Collect all subjectIds (flatten)
        const allSubjectIds = Object.values(normalizedTimetable).flat();

        // Remove duplicates
        const uniqueSubjectIds = [
            ...new Set(allSubjectIds.map((id) => id.toString())),
        ];

        // Validate all subject IDs
        for (const id of uniqueSubjectIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid subject ID in timetable",
                });
            }
        }

        // Check ownership of subjects
        const validSubjects = await Subject.find({
            _id: { $in: uniqueSubjectIds },
            semesterId,
            userId,
        }).select("_id");

        if (validSubjects.length !== uniqueSubjectIds.length) {
            return res.status(400).json({
                message: "Some subjects are invalid or do not belong to user",
            });
        }
        // Create or Update timetable (UPSERT)
        const savedTimetable = await Timetable.findOneAndUpdate(
            { semesterId },
            { timetable: normalizedTimetable },
            { new: true, upsert: true },
        );

        return res.status(201).json(savedTimetable);
    } catch (error) {
        return throwError(res, error, "postTimetable");
    }
};

export const getTimetable = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const userId = req.user._id;

        // Validate semesterId
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "Invalid semester ID" });
        }

        // Check ownership
        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        });

        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        // Get timetable + populate subjects
        const timetable = await Timetable.findOne({ semesterId })
            .populate("timetable.Monday", "subjectName attendance")
            .populate("timetable.Tuesday", "subjectName attendance")
            .populate("timetable.Wednesday", "subjectName attendance")
            .populate("timetable.Thursday", "subjectName attendance")
            .populate("timetable.Friday", "subjectName attendance")
            .populate("timetable.Saturday", "subjectName attendance")
            .lean({ virtuals: true });

        if (!timetable) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        // GET USER (needed for safe & target %)
        const user = await User.findById(userId);

        // DAYS ARRAY
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        // ✅ ADD STATS TO EACH SUBJECT
        for (const day of days) {
            timetable.timetable[day] = timetable.timetable[day].map(
                (subject) => {
                    const stats = getAttendanceStats(
                        subject.attendance,
                        user.safePercentage,
                        user.targetPercentage,
                    );

                    return {
                        ...subject,
                        ...stats,
                    };
                },
            );
        }

        return res.status(200).json(timetable);
    } catch (error) {
        return throwError(res, error, "getTimetable");
    }
};

export const editTimetable = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { timetable, day, subjects } = req.body;
        const userId = req.user._id;

        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        // Validate semesterId
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "Invalid semester ID" });
        }

        // Check ownership
        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        });

        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        const existing = await Timetable.findOne({ semesterId });

        if (!existing) {
            return res.status(404).json({ message: "Timetable not found" });
        }

        let updatedTimetable = JSON.parse(JSON.stringify(existing.timetable));

        // Full update (safe partial update)
        if (timetable) {
            for (const d of days) {
                if (timetable[d] !== undefined) {
                    updatedTimetable[d] = Array.isArray(timetable[d])
                        ? timetable[d]
                        : [];
                }
            }
        }

        // Single day update
        if (day !== undefined && subjects !== undefined) {
            if (!days.includes(day)) {
                return res.status(400).json({ message: "Invalid day" });
            }

            if (!Array.isArray(subjects)) {
                return res
                    .status(400)
                    .json({ message: "Subjects must be an array" });
            }

            updatedTimetable[day] = subjects;
        }

        // Validate all subject IDs (flatten)
        const allSubjectIds = Object.values(updatedTimetable).flat();

        // Remove duplicates
        const uniqueSubjectIds = [
            ...new Set(allSubjectIds.map((id) => id.toString())),
        ];

        // Validate all subject IDs
        for (const id of uniqueSubjectIds) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    message: "Invalid subject ID in timetable",
                });
            }
        }

        // Check ownership of subjects
        const validSubjects = await Subject.find({
            _id: { $in: uniqueSubjectIds },
            semesterId,
            userId,
        }).select("_id");

        if (validSubjects.length !== uniqueSubjectIds.length) {
            return res.status(400).json({
                message: "Some subjects are invalid or do not belong to user",
            });
        }

        // Save updated timetable
        const updated = await Timetable.findOneAndUpdate(
            { semesterId },
            { timetable: updatedTimetable },
            { returnDocument: "after" },
        )
            .populate("timetable.Monday", "subjectName")
            .populate("timetable.Tuesday", "subjectName")
            .populate("timetable.Wednesday", "subjectName")
            .populate("timetable.Thursday", "subjectName")
            .populate("timetable.Friday", "subjectName")
            .populate("timetable.Saturday", "subjectName");

        return res.status(200).json(updated);
    } catch (error) {
        return throwError(res, error, "editTimetable");
    }
};
