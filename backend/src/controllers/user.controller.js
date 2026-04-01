import User from "../models/user.model.js";
import Semester from "../models/semester.model.js";
import Subject from "../models/subject.model.js";
import Assignment from "../models/assignment.model.js";
import Timetable from "../models/timetable.model.js";
import { throwError } from "../lib/api.error.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    MAX_EMAIL_LENGTH,
    MIN_NAME_LENGTH,
    MAX_NAME_LENGTH,
} from "../lib/configuration.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        let {
            name,
            email,
            oldPassword,
            newPassword,
            confirmPassword,
            safePercentage,
            targetPercentage,
        } = req.body;

        // Sanitization
        name = name?.trim();
        email = email?.trim().toLowerCase();
        safePercentage =
            safePercentage !== undefined ? Number(safePercentage) : undefined;

        targetPercentage =
            targetPercentage !== undefined
                ? Number(targetPercentage)
                : undefined;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Name
        if (name && name !== user.name) {
            if (
                name.length < MIN_NAME_LENGTH ||
                name.length > MAX_NAME_LENGTH
            ) {
                return res.status(400).json({
                    message: `Length of name should be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH}`,
                });
            }
            user.name = name;
        }

        // Email
        if (email && email !== user.email) {
            if (email.length > MAX_EMAIL_LENGTH) {
                return res.status(400).json({
                    message: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters.`,
                });
            }

            const emailRegex =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid Email" });
            }

            const existingEmail = await User.findOne({
                email,
                _id: { $ne: userId },
            });

            if (existingEmail) {
                return res
                    .status(400)
                    .json({ message: "Email already in use" });
            }

            user.email = email;
        }

        // Password
        if (newPassword) {
            if (!oldPassword) {
                return res
                    .status(400)
                    .json({ message: "Old password is required" });
            }
            if (!confirmPassword) {
                return res
                    .status(400)
                    .json({ message: "Enter confirm password" });
            }

            const isSame = await bcrypt.compare(oldPassword, user.password);
            if (!isSame) {
                return res.status(400).json({ message: "Incorrect password" });
            }

            if (
                newPassword.length < MIN_PASSWORD_LENGTH ||
                newPassword.length > MAX_PASSWORD_LENGTH
            ) {
                return res.status(400).json({
                    message: `Length of password should be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`,
                });
            }

            const isSamePassword = await bcrypt.compare(
                newPassword,
                user.password,
            );
            if (isSamePassword) {
                return res.status(400).json({
                    message: "New password must be different from old password",
                });
            }

            if (confirmPassword !== newPassword) {
                return res.status(400).json({
                    message: "Password mismatch",
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Target Percentages
        if (
            targetPercentage !== undefined &&
            targetPercentage !== user.targetPercentage
        ) {
            if (targetPercentage > 100 || targetPercentage < 1)
                return res.status(400).json({ message: "Invalid percentage" });
            if (safePercentage !== undefined) {
                if (targetPercentage < safePercentage)
                    return res.status(400).json({
                        message: `Should be more than ${safePercentage}`,
                    });
            } else {
                if (targetPercentage < user.safePercentage)
                    return res.status(400).json({
                        message: `Should be more than ${user.safePercentage}`,
                    });
            }
            user.targetPercentage = targetPercentage;
        }

        if (
            safePercentage !== undefined &&
            safePercentage !== user.safePercentage
        ) {
            if (safePercentage > 100 || safePercentage < 1)
                return res.status(400).json({ message: "Invalid percentage" });
            if (targetPercentage !== undefined) {
                if (targetPercentage < safePercentage)
                    return res.status(400).json({
                        message: `Should be less than ${targetPercentage}`,
                    });
            } else {
                if (user.targetPercentage < safePercentage)
                    return res.status(400).json({
                        message: `Should be less than ${user.targetPercentage}`,
                    });
            }
            user.safePercentage = safePercentage;
        }

        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                safePercentage: user.safePercentage,
                targetPercentage: user.targetPercentage,
            },
        });
    } catch (error) {
        return throwError(res, error, "updateProfile");
    }
};

export const deleteUser = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const userId = req.user._id;
        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }

        await Assignment.deleteMany(
            {
                userId,
            },
            { session },
        );
        await Subject.deleteMany(
            {
                userId,
            },
            { session },
        );

        await Timetable.deleteMany(
            {
                userId,
            },
            { session },
        );
        await Semester.deleteMany(
            {
                userId,
            },
            { session },
        );
        await user.deleteOne({ session });
        await session.commitTransaction();

        // Clear cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        return throwError(res, error, "deleteUser");
    } finally {
        session.endSession();
    }
};
