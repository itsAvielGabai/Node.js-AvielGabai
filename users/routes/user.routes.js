import { Router } from "express";
import User from "../models/User.schema.js";
import {
    changeAuthLevel, createNewUser, deleteUser,
    existingUser, getUserById, updateUser
} from "../services/usersDataAccess.service.js";
import { validate } from "../../middlewares/validation.js";
import RegisterSchema from "../validations/RegisterSchema.js";
import LoginSchema from "../validations/LoginSchema.js";
import { generateToken } from "../../services/auth.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.js";
import { isRegisteredUser } from "../../middlewares/isRegisteredUser.js";
import { isUser } from "../../middlewares/isUser.js";
import lodash from "lodash";
const { pick } = lodash;

const userRouter = Router();

userRouter.get("/", auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        const newUsers = users.map(user => pick(user, ["_id", "name", "image", "isBusiness", "email", "address", "phone"]));
        return res.json(newUsers);
    } catch (err) {
        return res.status(500).send(err.message);
    };
});

userRouter.get("/:id", auth, isUser, async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        return res.json(user);
    } catch (err) {
        res.status(404).send(err.message);
    };
});

userRouter.post("/register", validate(RegisterSchema), async (req, res) => {
    try {
        console.log("Raw request body:", req.body); // Log request body
        const user = await createNewUser(req.body);
        return res.json({ message: "new user created successfully", user });
    } catch (err) {
        return res.status(400).send(err.message);
    };
});

userRouter.post("/login", validate(LoginSchema), async (req, res) => {
    try {
        const user = await existingUser(req.body);
        return res.json(generateToken(user));
    } catch (err) {
        //to handle specific error messages
        if (err.message === "No user found with the provided email address") {
            return res.status(404).send(err.message); //not found
        };

        if (err.message === "Password is incorrect") {
            return res.status(401).send(err.message); // Unauthorized
        };
        // For other unexpected error, we return a 500 status
        return res.status(500).send(err.message);
    };
});

userRouter.delete("/:id", auth, isUser, async (req, res) => {
    try {
        const user = await deleteUser(req.params.id);
        return res.json({ message: "User deleted successfully", user: user });
    } catch (err) {
        res.status(404).send(err.message);
    };
});

userRouter.put("/:id", auth, isRegisteredUser(false), async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        return res.json(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

userRouter.patch("/:id", auth, isUser, async (req, res) => {
    try {
        const foundUser = await changeAuthLevel(req.params.id);
        return res.json({ message: "auth level changed successfully", foundUser });
    } catch (err) {
        res.status(400).send(err.message);
    };
});

export default userRouter;