import User from "../models/User.schema.js"
import { comparePassword, hashPassword } from "./password.service.js";
import lodash from "lodash";
const { pick } = lodash;
import lockUser from "../models/LoginTries.schema.js"

/* ----- GET user by Id request ----- */
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User Not Found");
        };
        const returnUser = pick(user, ["_id", "name", "image", "isBusiness", "email", "address", "phone"]);
        return returnUser;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- POST add new user request -- (register) ----- */
const createNewUser = async (userData) => {
    try {
        const checkEmail = await User.findOne({ email: userData.email });
        if (checkEmail) {
            throw new Error("Email already exists");
        };
        const newUser = new User(userData);
        newUser.password = await hashPassword(newUser.password);
        await newUser.save();
        if (!userData) {
            throw new Error("User Not Created");
        }
        const returnUser = pick(newUser.toObject(), ["_id", "name", "image", "isBusiness", "email", "address", "phone"]);
        return returnUser;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- function for the login route----- */
const existingUser = async (userData) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: userData.email });
        if (!user) {
            throw new Error("No user found with the provided email address.");
        }

        // Find the user's lock record
        let userBlocks = await lockUser.findOne({ userId: user._id.toString() });

        // If the account is locked, check if the 24-hour block has passed
        if (userBlocks && userBlocks.tries >= 3) {
            const timeDifference = new Date() - new Date(userBlocks.lastLoginDate);
            const hoursPassed = timeDifference / (1000 * 60 * 60);

            if (hoursPassed <= 24) {
                throw new Error(
                    "Your account is temporarily locked due to multiple failed login attempts. Please try again after 24 hours."
                );
            }

            // Reset lock after 24 hours
            await lockUser.findByIdAndDelete(userBlocks._id);
            userBlocks = null; // Reset the block record for fresh attempts
        }

        // Verify the password
        const checkPassword = await comparePassword(userData.password, user.password);
        if (!checkPassword) {
            // Handle incorrect password attempts
            if (!userBlocks) {
                userBlocks = new lockUser({
                    userId: user._id,
                    tries: 1,
                    lastLoginDate: new Date(), // Store as a proper Date object
                });
                await userBlocks.save();
            } else {
                userBlocks.tries++;
                userBlocks.lastLoginDate = new Date();
                await userBlocks.save();
            }

            throw new Error("Password is incorrect.");
        }

        // Successful login: remove lock record if it exists
        if (userBlocks) {
            await lockUser.findByIdAndDelete(userBlocks._id);
        }

        return user;
    } catch (err) {
        console.error("Error during login:", err.message);
        throw new Error(err.message);
    }
};

/* ----- DELETE user by Id request ----- */
const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error("User Was Not Found");
        };
        const returnUser = pick(user, ["_id", "name", "image", "isBusiness", "email", "address", "phone"]);
        return returnUser;
    } catch (err) {
        throw new Error(err.message);
    };
};

/* ----- PUT user by Id request ----- */
const updateUser = async (userId, userData) => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: userData },
            { new: true, runValidators: true }
        );
        if (!user) {
            throw new Error("User Was Not Found");
        }
        const returnUser = pick(user, ["_id", "name", "image", "isBusiness", "email", "address", "phone",
        ]);
        return returnUser;
    } catch (err) {
        throw new Error(err.message);
    }
};
/* ----- PATCH request to change the authLevel ----- */
const changeAuthLevel = async (userId) => {
    try {
        const user = await User.findById(userId);
        user.isBusiness = !user.isBusiness;
        await user.save();
        const returnUser = pick(user, ["_id", "name", "image", "isBusiness", "email", "address", "phone"]);
        return returnUser;
    } catch (err) {
        throw new Error(err.message);
    };
};

export { createNewUser, getUserById, deleteUser, updateUser, changeAuthLevel, existingUser };