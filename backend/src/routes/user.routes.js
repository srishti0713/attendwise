import { updateProfile, deleteUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import express from "express";

const router = express.Router();

// PATCH
router.patch("/update", verifyJWT, upload.single(), updateProfile);

// DELETE
router.delete("/", verifyJWT, deleteUser);

export default router;
