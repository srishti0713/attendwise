import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import User from "../models/user.model.js";
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

        if (dueDate < Date.now()) {
            return res
                .status(400)
                .json({ message: "Due date cannot be in past" });
        }

        // Convert to Date object
        dueDate = new Date(dueDate);

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

export const getSubjectAssignment = async (req, res) => {
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
            subjectId: subjectId,
            userId: userId,
        }).sort({ dueDate: 1 });

        return res.status(200).json(assignments);
        
    } catch (error) {
        return throwError(res, error, "getSubjectAssignment");
    }
};
