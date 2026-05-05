import User from "../models/user.model.js";
import Semester from "../models/semester.model.js";
import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import Timetable from "../models/timetable.model.js";
import { throwError } from "../lib/api.error.js";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "../lib/configuration.js";
import mongoose from "mongoose";

export const addSemester = async (req, res) => {
    try {
        let { semesterName, isCurrent } = req.body;

        // Sanitization
        semesterName = semesterName?.trim();

        // Field Validation
        if (!semesterName)
            return res
                .status(400)
                .json({ message: "Semester name is required" });
        if (
            semesterName?.length < MIN_TITLE_LENGTH ||
            semesterName?.length > MAX_TITLE_LENGTH
        )
            return res.status(400).json({
                message: `Semester name must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
            });

            

        if (typeof isCurrent !== "boolean") {
            isCurrent = false;
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const existing = await Semester.findOne({
            userId: req.user._id,
            semesterName,
        });

        if (existing)
            return res.status(400).json({ message: "Semester already exists" });

        // Create semester
        const semester = await Semester.create({
            userId: req.user._id,
            semesterName,
            isCurrent,
        });

        if (isCurrent === true || user.semesters.length === 0) {
            // Unset all previous semesters
            await Semester.updateMany(
                { userId: req.user._id, _id: { $ne: semester._id } }, // exclude the new one
                { isCurrent: false },
            );

            semester.isCurrent = true;
            await semester.save(); // Save the updated semester
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: { semesters: semester._id },
        });

        return res.status(201).json(semester);
    } catch (error) {
        return throwError(res, error, "addSemester");
    }
};

export const getSemester = async (req, res) => {
    try {
        const { semesterId } = req.params;

        // Validate semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            return res.status(400).json({ message: "Invalid semester ID" });
        }

        // Find semester
        const semester = await Semester.findOne({
            _id: semesterId,
            userId: req.user._id,
        }).lean();

        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        return res.status(200).json(semester);
    } catch (error) {
        return throwError(res, error, "getSemester");
    }
};

export const getSemesters = async (req, res) => {
    

    try {
        const userId = req.user._id;

        const semesters = await Semester.find({ userId }).lean();

        return res.status(200).json(semesters);
    } catch (error) {
        return throwError(res, error, "getSemesters");
    }
};

export const deleteSemester = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const { semesterId } = req.params;

        // Validate semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid semester ID" });
        }

        // Remove assignments linked to subjects of the semester
        const subjects = await Subject.find({
            semesterId,
            userId: req.user._id,
        }).session(session);

        const subjectIds = subjects.map((subject) => subject._id);
        await Assignment.deleteMany(
            { subjectId: { $in: subjectIds } },
            { session },
        );

        // Remove semester from user
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { semesters: semesterId },
            },
            { session },
        );

        // Remove subjects linked to semester
        await Subject.deleteMany(
            { semesterId, userId: req.user._id },
            { session },
        );

        // Remove timetable linked to semester
        await Timetable.findOneAndDelete(
            { semesterId, userId: req.user._id },
            { session },
        );

        // Remove semester
        await Semester.findOneAndDelete(
            {
                _id: semesterId,
                userId: req.user._id,
            },
            { session },
        );

        await session.commitTransaction();
        return res
            .status(200)
            .json({ message: "Semester deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        return throwError(res, error, "deleteSemester");
    }
};

export const editSemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        let { semesterName, isCurrent } = req.body;

        // Sanitization
        semesterName = semesterName?.trim();

        // Field Validation
        if (!semesterName)
            return res
                .status(400)
                .json({ message: "Semester name is required" });
        if (
            semesterName?.length < MIN_TITLE_LENGTH ||
            semesterName?.length > MAX_TITLE_LENGTH
        )
            return res.status(400).json({
                message: `Semester name must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
            });

        // Find semester
        const semester = await Semester.findOne({
            _id: semesterId,
            userId: req.user._id,
        });

        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        // Update semester
        semester.semesterName = semesterName;

        if (isCurrent == true && !semester.isCurrent) {
            // unset previous
            await Semester.updateMany(
                { userId: req.user._id },
                { isCurrent: false },
            );
        }

        semester.isCurrent = true;

        await semester.save();

        return res
            .status(200)
            .json({ message: "Semester updated successfully" });
    } catch (error) {
        return throwError(res, error, "editSemester");
    }
};

export const getCurrentSemester = async (req, res) => {
    try {
        const semester = await Semester.findOne({
            userId: req.user._id,
            isCurrent: true,
        });

        if (!semester) {
            return res.status(404).json({ message: "No active semester" });
        }

        return res.status(200).json(semester);
    } catch (error) {
        return throwError(res, error, "getCurrentSemester");
    }
};
