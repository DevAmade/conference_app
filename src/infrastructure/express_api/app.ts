import express from 'express';

import conferenceRoute from './routes/conference.routes';
import { jsonResponseMiddleware } from './middlewares/json-response.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jsonResponseMiddleware);

app.use(conferenceRoute);

app.use(errorHandlerMiddleware);

export default app;