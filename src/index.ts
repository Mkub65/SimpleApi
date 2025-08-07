import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/router';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`${process.env.DYNAMO_TABLE_NAME}`)
});