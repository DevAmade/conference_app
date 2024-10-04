import { addDays, addHours } from 'date-fns';
import { Application } from 'express';
import request from 'supertest';

import { ConferenceRepository } from '../conference/ports/conference-repository.interface';

import container from '../infrastructure/express_api/config/dependency-injection';

import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seed';
import { e2eConferences } from './seeds/conference-seed';
import { e2eBookings } from './seeds/booking-seed';

describe('Feature: Change the dates of conference', () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([
            e2eUsers.johnDoe,
            e2eUsers.bob,
            e2eUsers.alice,
            e2eBookings.aliceBooking,
            e2eBookings.bobBooking,
            e2eConferences.conference1
        ]);
        app = testApp.expressApp;
    })

    afterAll(async () => {
        await testApp.tearDown();
    })

    describe('Scenario: Happy path', () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 8);
        const id = e2eConferences.conference1.entity.props.id;
        
        it('Should change the dates', async () => {    
            const result = await request(app)
                                .patch(`/conference/dates/${id}`)
                                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                                .send({ startDate, endDate });
                
            expect(result.status).toBe(200);
    
            const conferenceRepository = container.resolve('conferenceRepository') as ConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(id);
    
            expect(fetchedConference).toBeDefined();
            expect(fetchedConference?.props.startDate).toEqual(startDate);
            expect(fetchedConference?.props.endDate).toEqual(endDate);
        })
    })

    describe('Scenario: User is not authorized', () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const id = e2eConferences.conference1.entity.props.id;

        it('Shloud return 403 Unauthorized', async () => {
            const result = await request(app)
                                .patch(`/conference/dates/${id}`)
                                .send({ startDate, endDate });
                
            expect(result.status).toBe(403);
        })
    })
})