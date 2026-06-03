import {
    addAssignment,
    getAssignment,
    getSubjectAssignments,
    getSemesterAssignments,
    getCompletedAssignments,
    editAssignment,
    deleteAssignment,
} from "../controllers/assignment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post(
    "/create-assignment/:subjectId",
    verifyJWT,
    addAssignment,
);

// GET
router.get("/get-assignment/:assignmentId", verifyJWT, getAssignment);
router.get(
    "/get-subjectAssignments/:subjectId",
    verifyJWT,
    getSubjectAssignments,
);
router.get(
    "/get-semesterAssignments/:semesterId",
    verifyJWT,
    getSemesterAssignments,
);
router.get(
    "/get-completedAssignments/:subjectId",
    verifyJWT,
    getCompletedAssignments,
);

// PATCH
router.patch("/edit-assignment/:assignmentId", verifyJWT, editAssignment);

// DELETE
router.delete("/delete-assignment/:assignmentId", verifyJWT, deleteAssignment);

export default router;
