import express from "express";
import { extractTimetable } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post(
    "/extract-timetable",
    verifyJWT,
    upload.single("image"),
    extractTimetable,
);

export default router;
