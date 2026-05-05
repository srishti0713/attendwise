import {
    postTimetable,
    editTimetable,
    getTimetable,
} from "../controllers/timetable.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/:semesterId", upload.single(), verifyJWT, postTimetable);

// GET
router.get("/:semesterId", verifyJWT, getTimetable);

// PATCH
router.patch("/:semesterId", verifyJWT, editTimetable);

export default router;
