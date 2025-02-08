/* ------ this file is responsible for env services ------ */

import env from 'dotenv'; 
env.config();  // connects to the env file (loads the variables from .env into process.env.)

export const PORT = process.env.PORT || 8181; // that way we get to the variable in the .env file 
export const MONGO_LOCAL = process.env.MONGO_LOCAL;
//export const MONGO_ATLAS = process.env.MONGO_ATLAS;
export const SECRET_KEY = process.env.SECRET_KEY;