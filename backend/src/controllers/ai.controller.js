import fs from "node:fs";
import aiService from "../services/ai.service.js";
import Timetable from "../models/timetable.model.js";
import Subject from "../models/subject.model.js";
import { throwError } from "../lib/api.error.js";

export const extractTimetable = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const { parsed, raw } = await aiService.extractTimetableFromImage(
            req.file.path,
            req.file.mimetype,
        );

        

        const timetable = {};

        for (const day of Object.keys(parsed.days)) {
            const subjects = parsed.days[day];

            const subjectDocs = await Subject.find({
                subjectName: { $in: subjects },
                userId: req.user._id,
            });

            const map = {};
            subjectDocs.forEach((s) => {
                map[s.subjectName] = s._id;
            });

            timetable[day] = subjects.map((code) => map[code]).filter(Boolean);
        }

        fs.unlinkSync(req.file.path);

        return res.status(200).json({
            aiRaw: parsed,
        });
    } catch (error) {
        console.log(error);

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return throwError(res, error, "extractTimetable");
    }
};
