import userSeed from "../../users/initialData/initialUsers.json" with {type: "json"};

import User from "../../users/models/User.schema.js";
import { hashPassword } from "../services/password.service.js";

export const seedUsers = async () => {

    const usersFromDB = await User.find();

    try {
        for (const user of userSeed) {
            if (usersFromDB.find((dbUser) => dbUser.email === user.email)) {
                continue;
            };
            const newUser = new User(user);
            newUser.password = await hashPassword(newUser.password);
            await newUser.save();
            console.log("User created ", newUser.email);
        };
    } catch (err) {
        console.log(err.message);
    };
};