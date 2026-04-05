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
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: false,
    });
    return token;
};
export { generateTokenAndSetCookie };
