import { verifyToken } from "../services/auth.service.js";

export const auth = async (req, res, next) => {
    try {
        const tokenFromClient = req.header("x-auth-token");
        const userData = verifyToken(tokenFromClient);
        if (!userData || !tokenFromClient) {
            throw new Error("Authentication failed: Missing or invalid token. Please log in to access this resource.");
        };
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    };
};