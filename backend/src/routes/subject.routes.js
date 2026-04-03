import {
    addSubject,
    updateSubject,
    getSubject,
    getSubjects,
    deleteSubject,
} from "../controllers/subject.controller";
import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/:semesterId", verifyJWT, addSubject);

// GET
router.get("/:semesterId", verifyJWT, getSubjects);
router.get("/:subjectId", verifyJWT, getSubject);

// PATCH
router.patch("/:subjectId", verifyJWT, updateSubject);

// DELETE
router.delete("/:subjectId", verifyJWT, deleteSubject);

export default router;
