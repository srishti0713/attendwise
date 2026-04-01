import { updateProfile, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// PATCH
router.patch("/update", verifyJWT, updateProfile);

// DELETE
router.delete("/", deleteUser);

export default router;
