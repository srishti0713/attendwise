import {
    addSemester,
    getSemester,
    getSemesters,
    deleteSemester,
    editSemester,
    getCurrentSemester,
} from "../controllers/semester.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/create-semester", upload.single(), verifyJWT, addSemester);

// GET
router.get("/get-semesters", verifyJWT, getSemesters);
router.get("/current", verifyJWT, getCurrentSemester);
router.get("/:semesterId", verifyJWT, getSemester);

// PATCH
router.patch("/:semesterId", verifyJWT, editSemester);

// DELETE
router.delete("/:semesterId", verifyJWT, deleteSemester);

export default router;
