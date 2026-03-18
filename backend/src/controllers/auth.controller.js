import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../lib/token.js";
import { throwError } from "../lib/api.error.js";
import {
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    FOLDER_NAME,
    MAX_EMAIL_LENGTH,
} from "../lib/configuration.js";

const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        //Sanitization
        name = name?.trim();
        email = email?.trim().toLowerCase();

        //Field Validation
        //Name
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        //Email
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (email.length > MAX_EMAIL_LENGTH) {
            return res.status(400).json({
                message: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters.`,
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        //Password
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (
            password.length < MIN_PASSWORD_LENGTH ||
            password.length > MAX_PASSWORD_LENGTH
        ) {
            return res.status(400).json({
                message: `Length of password should be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`,
            });
        }

        //Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        generateTokenAndSetCookie(newUser?._id, res);

        return res
            .status(201)
            .json({ name: newUser.name, email: newUser.email });
    } catch (error) {
        return throwError(res, error, "register");
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email?.trim().toLowerCase();

        //Field validation
        //Email
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (email.length > MAX_EMAIL_LENGTH) {
            return res.status(400).json({
                message: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters.`,
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        //Password
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (
            password.length < MIN_PASSWORD_LENGTH ||
            password.length > MAX_PASSWORD_LENGTH
        ) {
            return res.status(400).json({
                message: `Password should be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`,
            });
        }

        //Password check
        const validPassword = await bcrypt.compare(password, user?.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        //Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        return throwError(res, error, "login");
    }
};

const logoutUser = async (req, res) => {
    try {
        //Site options
        const options = {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("jwt", options)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        return throwError(res, error, "logout");
    }
};

const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        return throwError(res, error, "currentUser");
    }
};

export { registerUser, loginUser, logoutUser, currentUser };
