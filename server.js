import chalk from 'chalk';
import express from 'express';
import cors from "cors";
import router from './router/router.js';
import { morganLogger } from './middlewares/logger.js';
import { badRequest } from './middlewares/badRequest.js';
import { connectServer } from './services/db.service.js';
import { seedUsers } from './users/dataSeed/usersSeed.js';
import seedCards from './cards/dataSeed/cardsSeed.js';

import { PORT } from './services/env.service.js';

const app = express();

app.use(express.json({ limit: '5mb' }));

app.use(morganLogger);

app.use(cors());

app.use(express.static('public'));

app.use(router);

// Add middleware to handle 404 errors
app.use(badRequest);

// Add middleware to handle 500 errors
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send("Something BROKE !");
});

app.listen(PORT, async () => {
    console.log(chalk.magenta(`App Is Running On Port ${PORT}`));

    await connectServer();
    await seedUsers();
    await seedCards();
});