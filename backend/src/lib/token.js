import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign(
        {
            userId,
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.TOKEN_EXPIRY,
        },
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax", // lax works fine for same-origin local dev
        secure: isProduction,
    });
    return token;
};
export { generateTokenAndSetCookie };
