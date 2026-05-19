import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";
import Semester from "../models/semester.model.js";
import { throwError } from "../lib/api.error.js";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "../lib/configuration.js";
import mongoose from "mongoose";
import {
    getAttendanceStats,
    getOverallAttendance,
} from "../utils/attendance.util.js";
import Timetable from "../models/timetable.model.js";
import Assignment from "../models/assignment.model.js";

export const getSubjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const { semesterId } = req.params;

        // Validate semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId))
            return res.status(400).json({ message: "Invalid semester ID" });

        // Find user
        const user = await User.findById(userId);

        // Find semester
        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        })
            .populate("subjects", "subjectName attendance")
            .lean();

        if (!semester)
            return res.status(404).json({ message: "Subjects not found" });

        // Attendance details calculation
        const result = semester.subjects.map((subject) => {
            const stats = getAttendanceStats(
                subject.attendance,
                user.safePercentage,
                user.targetPercentage,
            );

            return {
                ...subject,
                ...stats,
            };
        });

        // Calculate overall AFTER stats are computed
        const overallStats = getOverallAttendance(result);

        const finalResult = result.map((subject) => ({
            ...subject,
            ...overallStats,
        }));

        return res.status(200).json(finalResult);
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

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find subject
        const subject = await Subject.findOne({
            _id: subjectId,
            userId,
        }).lean();
        if (!subject)
            return res.status(404).json({ message: "Subject not found" });

        // Return with stats
        const stats = getAttendanceStats(
            subject.attendance,
            user.safePercentage,
            user.targetPercentage,
        );

        return res.status(200).json({
            ...subject,
            ...stats,
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

            if (attendedClasses < 0 || isNaN(attendedClasses))
                return res
                    .status(400)
                    .json({ message: "Invalid number of attended classes" });

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

export const updateSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        let { subjectName, attendanceId, status } = req.body;

        // Validate subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).json({ message: "Invalid subject ID" });
        }

        const subject = await Subject.findOne({
            _id: subjectId,
            userId: req.user._id,
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Update subject name
        if (subjectName !== undefined) {
            subjectName = subjectName.trim();

            if (!subjectName) {
                return res
                    .status(400)
                    .json({ message: "Subject name cannot be empty" });
            }

            if (
                subjectName.length < MIN_TITLE_LENGTH ||
                subjectName.length > MAX_TITLE_LENGTH
            ) {
                return res.status(400).json({
                    message: `Subject name must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
                });
            }

            subject.subjectName = subjectName;
        }

        // Update attendance
        if ((attendanceId && !status) || (!attendanceId && status)) {
            return res.status(400).json({
                message: "Both attendanceId and status are required",
            });
        }

        if (attendanceId !== undefined && status !== undefined) {
            const validStatuses = ["attended", "missed", "off"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            const existingEntry = subject.attendance.id(attendanceId);
            if (!existingEntry) {
                return res.status(404).json({ message: "Attendance entry not found" });
            }

            existingEntry.status = status;
        }

        await subject.save();

        // Return with stats
        const user = await User.findById(req.user._id);

        const stats = getAttendanceStats(
            subject.attendance,
            user.safePercentage,
            user.targetPercentage,
        );

        return res.status(200).json({
            ...subject.toObject(),
            ...stats,
        });
    } catch (error) {
        return throwError(res, error, "updateSubject");
    }
};

export const deleteSubject = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { subjectId } = req.params;

        // Validate subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid subject ID" });
        }

        // Find subject
        const subject = await Subject.findOne({
            _id: subjectId,
            userId: req.user._id,
        }).session(session);

        if (!subject) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Subject not found" });
        }

        // Remove from semester
        await Semester.findOneAndUpdate(
            { _id: subject.semesterId, userId: req.user._id },
            { $pull: { subjects: subjectId } },
            { session },
        );

        // Remove from timetable
        await Timetable.updateMany(
            { semesterId: subject.semesterId },
            {
                $pull: {
                    "timetable.Monday": subjectId,
                    "timetable.Tuesday": subjectId,
                    "timetable.Wednesday": subjectId,
                    "timetable.Thursday": subjectId,
                    "timetable.Friday": subjectId,
                    "timetable.Saturday": subjectId,
                },
            },
            { session },
        );

        // Remove assignments
        await Assignment.deleteMany(
            { subjectId, userId: req.user._id },
            { session },
        );

        // Delete subject
        await subject.deleteOne({ session });

        await session.commitTransaction();

        return res.status(200).json({
            message: "Subject deleted successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        return throwError(res, error, "deleteSubject");
    } finally {
        session.endSession();
    }
};
