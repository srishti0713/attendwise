import {
    registerUser,
    loginUser,
    logoutUser,
    currentUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

// POST
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

// GET
router.get("/me", verifyJWT, currentUser);

export default router;
