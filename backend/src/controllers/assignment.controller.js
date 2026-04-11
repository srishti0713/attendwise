import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import Semester from "../models/semester.model.js";
import CompletedAssignment from "../models/completedAssignment.model.js";
import { throwError } from "../lib/api.error.js";
import mongoose from "mongoose";
import {
    MAX_TITLE_LENGTH,
    MIN_TITLE_LENGTH,
    MIN_DESCRIPTION_LENGTH,
    MAX_DESCRIPTION_LENGTH,
} from "../lib/configuration.js";

export const addAssignment = async (req, res) => {
    try {
        const { subjectId } = req.params;
        let { title, description, dueDate } = req.body;

        //Sanitization
        title = title?.trim();
        description = description?.trim();

        // Field validation
        // Subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId))
            return res.status(400).json({ message: "Invalid subject ID" });

        const subject = await Subject.findOne({
            _id: subjectId,
            userId: req.user._id,
        });
        if (!subject)
            return res.status(404).json({ message: "Subject not found" });

        // Title
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (
            title.length < MIN_TITLE_LENGTH ||
            title.length > MAX_TITLE_LENGTH
        ) {
            return res.status(400).json({
                message: `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
            });
        }

        // Description
        if (
            description &&
            (description.length < MIN_DESCRIPTION_LENGTH ||
                description.length > MAX_DESCRIPTION_LENGTH)
        ) {
            return res.status(400).json({
                message: `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`,
            });
        }

        // Duedate
        if (!dueDate) {
            return res.status(400).json({ message: "Due date is required" });
        }

        if (isNaN(new Date(dueDate))) {
            return res
                .status(400)
                .json({ message: "Due date should be valid" });
        }

        const parsedDate = new Date(dueDate);
        if (parsedDate < new Date()) {
            return res
                .status(400)
                .json({ message: "Due date cannot be in past" });
        }

        // Convert to Date object
        dueDate = parsedDate;

        //Create Assignment
        const assignment = await Assignment.create({
            userId: req.user._id,
            subjectId,
            title,
            description: description || "",
            dueDate,
        });

        return res.status(201).json(assignment);
    } catch (error) {
        return throwError(res, error, "addAssignment");
    }
};

export const getAssignment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { assignmentId } = req.params;

        // Validate assignment ID
        if (!mongoose.Types.ObjectId.isValid(assignmentId))
            return res.status(400).json({ message: "Invalid assignment ID" });

        // Fetch assignment
        const assignment = await Assignment.findOne({
            _id: assignmentId,
            userId,
            status: "pending",
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        return res.status(200).json(assignment);
    } catch (error) {
        return throwError(res, error, "getAssignment");
    }
};

export const getSubjectAssignments = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subjectId } = req.params;

        // Validate subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId))
            return res.status(400).json({ message: "Invalid subject ID" });

        const subject = await Subject.findOne({
            _id: subjectId,
            userId: userId,
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Finding all the assignments of that user for a subject
        const assignments = await Assignment.find({
            subjectId,
            userId,
            status: "pending",
        }).sort({ dueDate: 1 });

        return res.status(200).json(assignments);
    } catch (error) {
        return throwError(res, error, "getSubjectAssignment");
    }
};

export const getCompletedAssignments = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subjectId } = req.params;

        // Validate subject ID
        if (!mongoose.Types.ObjectId.isValid(subjectId))
            return res.status(400).json({ message: "Invalid subject ID" });

        const subject = await Subject.findOne({
            _id: subjectId,
            userId: userId,
        });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Finding all the assignments of that user for a subject
        const assignments = await Assignment.find({
            subjectId,
            userId,
            status: "completed",
        });

        return res.status(200).json(assignments);
    } catch (error) {
        return throwError(res, error, "getCompletedSubjectAssignment");
    }
};

export const getSemesterAssignments = async (req, res) => {
    try {
        const userId = req.user._id;
        const { semesterId } = req.params;

        // Validate semester ID
        if (!mongoose.Types.ObjectId.isValid(semesterId))
            return res.status(400).json({ message: "Invalid semester ID" });

        // Find semester
        const semester = await Semester.findOne({
            _id: semesterId,
            userId,
        })
            .populate("subjects")
            .lean();

        if (!semester)
            return res.status(404).json({ message: "Semester not found" });

        // Extract subject IDs
        const subjectIds = semester.subjects.map((sub) => sub._id);

        // Fetch all assignments for these subjects
        const assignments = await Assignment.find({
            userId,
            subjectId: { $in: subjectIds },
            status: "pending",
        }).sort({ dueDate: 1 });

        return res.status(200).json(assignments);
    } catch (error) {
        return throwError(res, error, "getSemesterAssignment");
    }
};

export const editAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        let { title, description, dueDate, status } = req.body;

        // Field Validation
        // Assignment ID
        if (!mongoose.Types.ObjectId.isValid(assignmentId))
            return res.status(400).json({ message: "Invalid assignment ID" });

        const assignment = await Assignment.findOne({
            _id: assignmentId,
            userId: req.user._id,
        });
        if (!assignment)
            return res.status(404).json({ message: "Assignment not found" });

        // Update assignment title

        if (title !== undefined) {
            title = title.trim();

            if (!title) {
                return res
                    .status(400)
                    .json({ message: "Title cannot be empty" });
            }

            if (
                title.length < MIN_TITLE_LENGTH ||
                title.length > MAX_TITLE_LENGTH
            ) {
                return res.status(400).json({
                    message: `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`,
                });
            }

            assignment.title = title;
        }

        // Update assignment description

        if (description !== undefined) {
            description = description.trim();

            if (!description) {
                return res
                    .status(400)
                    .json({ message: "Description cannot be empty" });
            }

            if (
                description.length < MIN_DESCRIPTION_LENGTH ||
                description.length > MAX_DESCRIPTION_LENGTH
            ) {
                return res.status(400).json({
                    message: `Description must be between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} characters`,
                });
            }

            assignment.description = description;
        }

        // Update assignment due date

        if (dueDate !== undefined) {
            const parsedDate = new Date(dueDate);

            if (isNaN(parsedDate)) {
                return res
                    .status(400)
                    .json({ message: "Due date should be valid" });
            }

            if (parsedDate < new Date()) {
                return res
                    .status(400)
                    .json({ message: "Due date cannot be in past" });
            }

            assignment.dueDate = parsedDate;
        }

        // Update assignment status

        if (status !== undefined) {
            const validStatuses = ["pending", "completed"];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    message: "Invalid status value",
                });
            }

            if (status === "completed" && assignment.status !== "completed") {
                await CompletedAssignment.create({
                    assignmentId: assignment._id,
                    userId: assignment.userId,
                    subjectId: assignment.subjectId,
                    title: assignment.title,
                    description: assignment.description,
                    dueDate: assignment.dueDate,
                    completedOn: new Date(),
                });
                assignment.status = status;
            } else if (status === "pending") {
                assignment.status = status;
            }
        }

        await assignment.save();
        return res.status(200).json(assignment);
    } catch (error) {
        return throwError(res, error, "updateAssignment");
    }
};

export const deleteAssignment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { assignmentId } = req.params;

        // Validate assignment ID
        if (!mongoose.Types.ObjectId.isValid(assignmentId))
            return res.status(400).json({ message: "Invalid assignment ID" });

        // Find assignment
        const assignment = await Assignment.findOne({
            _id: assignmentId,
            userId,
        });

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        await assignment.deleteOne();

        return res
            .status(200)
            .json({ message: "Assignment deleted successfully" });
    } catch (error) {
        return throwError(res, error, "deleteAssignment");
    }
};
