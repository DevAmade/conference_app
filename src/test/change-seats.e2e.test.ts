import { Application } from 'express';
import request from 'supertest';

import { ConferenceRepository } from '../conference/ports/conference-repository.interface';

import container from '../infrastructure/express_api/config/dependency-injection';

import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seed';
import { e2eConferences } from './seeds/conference-seed';

describe('Feature: Change the number of seats', () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([e2eUsers.johnDoe, e2eConferences.conference1]);
        app = testApp.expressApp;
    })

    afterAll(async () => {
        await testApp.tearDown();
    })

    describe('Scenario: Happy path', () => {
        it('Should change the number of seats', async () => {
            const seats = 100;
            const id = e2eConferences.conference1.entity.props.id;
    
            const result = await request(app)
                                .patch(`/conference/seats/${id}`)
                                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                                .send({ nbrSeat: seats });
                
            expect(result.status).toBe(200);
    
            const conferenceRepository = container.resolve('conferenceRepository') as ConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(id);
    
            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props.nbrSeat).toEqual(seats);
        })
    })

    describe('Scenario: User is not authorized', () => {
        it('Shloud return 403 Unauthorized', async () => {
            const seats = 100;
            const id = e2eConferences.conference1.entity.props.id;
    
            const result = await request(app)
                                .patch(`/conference/seats/${id}`)
                                .send({ nbrSeat: seats });
                
            expect(result.status).toBe(403);
        })
    })
})