import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './env.service.js';

/* Creates a JWT token */
const generateToken = (user) => {
    const { _id, isAdmin, isBusiness } = user;
    const payloadData = { _id, isAdmin, isBusiness };
    const token = jwt.sign(payloadData, SECRET_KEY, { expiresIn: "1d" });
    return token;
};

/*  Verifies the provided JWT token to ensure it’s valid and not expired, returning the decoded user data. */
const verifyToken = (tokenFromClient) => {
    try {
        const userData = jwt.verify(tokenFromClient, SECRET_KEY);
        return userData;
    } catch (error) {
        return null;
    };
};

export { generateToken, verifyToken };