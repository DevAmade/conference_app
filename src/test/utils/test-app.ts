import express from "express";
import { AwilixContainer } from "awilix";
import mongoose from 'mongoose';

import { jsonResponseMiddleware } from "../../infrastructure/express_api/middlewares/json-response.middleware";
import { errorHandlerMiddleware } from "../../infrastructure/express_api/middlewares/error-handler.middleware";
import conferenceRoute from '../../infrastructure/express_api/routes/conference.routes'
import container from "../../infrastructure/express_api/config/dependency-injection";

import { Fixture } from "../fixtures/fixture.interface";

export class TestApp {
    private app: express.Application;
    private container: AwilixContainer;

    constructor() {
        this.app = express();
        this.container = container;
    }

    async setup(): Promise<void> {
        await mongoose.connect('mongodb://admin:qwerty@localhost:3702/conference?authSource=admin');
        await mongoose.connection.db?.collection('users').deleteMany({});
        await mongoose.connection.db?.collection('conferences').deleteMany({});
        
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(jsonResponseMiddleware);
        this.app.use(conferenceRoute);
        this.app.use(errorHandlerMiddleware);
    }

    async tearDown() {
        await mongoose.connection.close();
    }

    async loadAllFixtures(fixtures: Fixture[]):Promise<void[]> {
        return Promise.all(fixtures.map(async fixture => await fixture.load(this.container)))
    }

    get expressApp(): express.Application {
        return this.app;
    }
}