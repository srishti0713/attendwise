import { throwError } from "../lib/api.error.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
    const token =
        req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new throwError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.userId).select("-password");

    if (!user) {
        throw new throwError(401, "Invalid Token");
    }

    req.user = user;
    next();
};
export { verifyJWT };
