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

        // Sanitization
        name = name?.trim();
        email = email?.trim().toLowerCase();

        //Field Validation
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (email.length > MAX_EMAIL_LENGTH) {
            return res
                .status(400)
                .json({
                    message: `Email cannot exceed length ${MAX_EMAIL_LENGTH}`,
                });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        if (
            password.length < MIN_PASSWORD_LENGTH ||
            password.length > MAX_PASSWORD_LENGTH
        ) {
            return res
                .status(400)
                .json({
                    message: `Password should be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`,
                });
        }

        //check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        generateTokenAndSetCookie(newUser._id, res);

        if (!newUser) {
            return res
                .status(400)
                .json({ message: "Failed to create new user" });
        }

        const createdUser = await User.findById(newUser._id).select(
            "-password",
        );

        return res.status(201).json({ createdUser });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: register ::", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email?.trim().toLowerCase();

        //Field validation
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (
            password.length < MIN_PASSWORD_LENGTH ||
            password.length > MAX_PASSWORD_LENGTH
        ) {
            return res
                .status(400)
                .json({
                    message: `Password should be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`,
                });
        }

        //Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //Password check
        const validPassword = await bcrypt.compare(password, user?.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        generateTokenAndSetCookie(user._id, res);

        const foundUser = await User.findById(user._id).select("-password");

        return res.status(200).json({ foundUser });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: login ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const logoutUser = async (req, res) => {
    try {
        //site options
        const options = {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("jwt", options)
            .json({ message: "User Logged Out Successfully" });
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: logout ::", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json(user);
    } catch (error) {
        console.log("ERROR :: CONTROLLER :: currentUser ::", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export { registerUser, loginUser, logoutUser, currentUser };
