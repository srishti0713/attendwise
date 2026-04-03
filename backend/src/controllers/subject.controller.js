import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";
import Semester from "../models/semester.model.js";
import { throwError } from "../lib/api.error.js";
import { classesNeeded } from "../utils/attendance.util.js";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "../lib/configuration.js";
import mongoose from "mongoose";

export const getSubjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const { semesterId } = req.params;

        // Validate semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId))
            return res.status(400).json({ message: "Invalid semester ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        })
            .populate("subjects", "subjectName totalClasses attendedClasses")
            .lean();

        if (!semester)
            return res.status(404).json({ message: "Subjects not found" });

        // Attendance details calculation
        const result = semester.subjects.map((subject) => {
            const attended = subject.attendedClasses;
            const total = subject.totalClasses;

            const current = total === 0 ? 0 : (attended / total) * 100;

            const min = user.safePercentage;
            const max = user.targetPercentage;

            const safeNeeded = classesNeeded(attended, total, min);
            const goalNeeded = classesNeeded(attended, total, max);

            let status, message;

            if (current < min) {
                status = "danger";
                message = `Attend ${safeNeeded} classes to reach ${min}%`;
            } else if (current < max) {
                status = "moderate";
                message = `Safe. Attend ${goalNeeded} more to reach ${max}%`;
            } else {
                status = "safe";
                message = `Above ${max}%`;
            }

            return {
                ...subject,
                attendancePercentage: Number(current.toFixed(2)),
                classesToSafeZone: safeNeeded,
                classesToGoal: goalNeeded,
                status,
                message,
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        return throwError(res, error, "getSubjects");
    }
};

export const getSubject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subjectId } = req.params;

        // Validate subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId))
            return res.status(400).json({ message: "Invalid subject ID" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const subject = await Subject.findOne({
            _id: subjectId,
            userId,
        }).lean();
        if (!subject)
            return (res.status(404), json({ message: "Subject not found" }));

        const attended = subject.attendedClasses;
        const total = subject.totalClasses;

        const current = total === 0 ? 0 : (attended / total) * 100;

        const min = user.safePercentage;
        const max = user.targetPercentage;

        const safeNeeded = classesNeeded(attended, total, min);
        const goalNeeded = classesNeeded(attended, total, max);

        let status, message;

        if (current < min) {
            status = "danger";
            message = `Attend ${safeNeeded} classes to reach ${min}%`;
        } else if (current < max) {
            status = "moderate";
            message = `Safe. Attend ${goalNeeded} more to reach ${max}%`;
        } else {
            status = "safe";
            message = `Above ${max}%`;
        }

        return res.status(200).json({
            ...subject,
            attendancePercentage: Number(current.toFixed(2)),
            classesToSafeZone: safeNeeded,
            classesToGoal: goalNeeded,
            status,
            message,
        });
    } catch (error) {
        return throwError(res, error, "getSubject");
    }
};

export const addSubject = async (req, res) => {
    try {
        const { semesterId } = req.params;
        let { subjectName, totalClasses, attendedClasses } = req.body;

        // Sanitization
        subjectName = subjectName?.trim();

        // Field validation
        // Semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId))
            return res.status(400).json({ message: "Invalid semester ID" });

        const semester = await Semester.findOne({
            _id: semesterId,
            userId: req.user._id,
        });
        if (!semester)
            return res.status(404).json({ message: "Semester not found" });

        // Subject name
        if (!subjectName)
            return res
                .status(400)
                .json({ message: "Subject name is required" });

        if (
            subjectName.length < MIN_TITLE_LENGTH ||
            subjectName.length > MAX_TITLE_LENGTH
        )
            return res.status(400).json({
                message: `Subject name must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
            });

        // Total classes
        if (totalClasses !== undefined) {
            totalClasses = Number(totalClasses);

            if (isNaN(totalClasses) || totalClasses < 0)
                return res
                    .status(400)
                    .json({ message: "Invalid number of total classes" });
        }

        // Attended classes
        if (attendedClasses !== undefined) {
            attendedClasses = Number(attendedClasses);

            if ( attendedClasses < 0|| isNaN(attendedClasses))
                return res
                    .status(400)
                    .json({ message: "Invalid number of total classes" });

           if (totalClasses !== undefined && attendedClasses > totalClasses)
                return res.status(400).json({
                    message:
                        "Number of classes attended cannot be more than total classes",
                });
        }

        // Create subject
        const subject = await Subject.create({
            userId: req.user._id,
            semesterId,
            subjectName,
            totalClasses,
            attendedClasses,
        });

        // Push subject into semester
        await Semester.findByIdAndUpdate(semesterId, {
            $push: { subjects: subject._id },
        });

        return res.status(201).json(subject);
    } catch (error) {
        return throwError(res, error, "addSubject");
    }
};

export const updateSubject = (req, res) => {};
