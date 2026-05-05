import {
    addSubject,
    updateSubject,
    getSubject,
    getSubjects,
    deleteSubject,
} from "../controllers/subject.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/:semesterId", upload.single(), verifyJWT, addSubject);

// GET
router.get("/get-subject/:subjectId", verifyJWT, getSubject);
router.get("/:semesterId", verifyJWT, getSubjects);

// PATCH
router.patch("/:subjectId", verifyJWT, updateSubject);

// DELETE
router.delete("/:subjectId", verifyJWT, deleteSubject);

export default router;
