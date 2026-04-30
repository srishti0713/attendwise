import { throwError } from "../lib/api.error.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const user = await User.findById(decodedToken?.userId).select(
            "-password",
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
export { verifyJWT };
