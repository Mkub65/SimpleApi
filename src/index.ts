import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/router';
import { loggingMiddleware } from './middleware/logginMiddleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(loggingMiddleware);
app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});