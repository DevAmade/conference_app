import { Application } from 'express';
import request from 'supertest';
import { addDays, addHours } from 'date-fns';

import { User } from '../user/entities/user.entity';

import { ConferenceRepository } from '../conference/ports/conference-repository.interface';

import container from '../infrastructure/express_api/config/dependency-injection';

import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seed';

describe('Feature: Organize Conference', () => {
    const johnDoe = new User({
        id: 'johnDoe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty'
    });

    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([e2eUsers.johnDoe]);
        app = testApp.expressApp;
    })

    afterAll(async () => {
        await testApp.tearDown();
    })

    it('Should organize a conference', async () => {
        const startDate = addDays(new Date(), 4);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const result = await request(app)
                            .post('/conference')
                            .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                            .send({
                                title: 'My first conference',
                                startDate,
                                endDate,
                                nbrSeat: 100
                            });
            
        expect(result.status).toBe(201);
        expect(result.body.data).toEqual({ id: expect.any(String) });

        const conferenceRepository = container.resolve('conferenceRepository') as ConferenceRepository;
        const fetchedConference = await conferenceRepository.findById(result.body.data.id);

        expect(fetchedConference).toBeDefined();
        expect(fetchedConference?.props).toEqual({
            id: result.body.data.id,
            organizerId: johnDoe.props.id,
            title: 'My first conference',
            startDate,
            endDate,
            nbrSeat: 100
        });
    })
})