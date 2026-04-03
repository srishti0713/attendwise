import User from "../models/user.model.js";
import Semester from "../models/semester.model.js";
import { throwError } from "../lib/api.error.js";
import { MAX_TITLE_LENGTH, MIN_TITLE_LENGTH } from "../lib/configuration.js";

export const addSemester = async (req, res) => {
    try {
        let { semesterName } = req.body;

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
        });

        // Push semester in user's semesters
        await User.findByIdAndUpdate(req.user._id, {
            $push: { semesters: semester._id },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(201).json(semester);
    } catch (error) {
        return throwError(res, error, "addSemester");
    }
};
