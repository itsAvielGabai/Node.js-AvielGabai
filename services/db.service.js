import { connect } from 'mongoose';
import chalk from 'chalk'; //colors the prints in terminal
import { MONGO_LOCAL } from './env.service.js';
// import { MONGO_ATLAS } from './env.service.js'; // that way we get to the variable in the .env file 

// const db = process.env.ENV === "dev" ? process.env.MONGO_LOCAL : process.env.MONGO_ATLAS;
// const name = db === process.env.MONGO_LOCAL ? "local" : "atlas";

// to hide important sensitive stuff like our connection to the database
export const connectServer = async () => {
    try {
        await connect(MONGO_LOCAL);
        console.log(chalk.yellow(`Connected to MongoDB`));
    } catch (error) {
        console.log(error);
    };
};