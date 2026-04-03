import {addSemester, getSemester, deleteSemester, editSemester} from "../controllers/semester.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/create-semester", verifyJWT, addSemester);

// GET
router.get("/:semesterId", verifyJWT, getSemester);

// PATCH
router.patch("/:semesterId", verifyJWT, editSemester);

// DELETE
router.delete("/:semesterId", verifyJWT, deleteSemester);

export default router;