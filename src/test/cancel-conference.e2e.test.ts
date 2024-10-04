import { Application } from 'express';
import request from 'supertest';

import { BookingRepository } from '../conference/ports/booking-repository.interface';
import { ConferenceRepository } from '../conference/ports/conference-repository.interface';

import container from '../infrastructure/express_api/config/dependency-injection';

import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seed';
import { e2eConferences } from './seeds/conference-seed';

describe('Feature: Cancel conference', () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([
            e2eUsers.johnDoe,
            e2eConferences.conference1
        ]);
        app = testApp.expressApp;
    })

    afterAll(async () => {
        await testApp.tearDown();
    })

    describe('Scenario: Happy path', () => {
        const conferenceId = e2eConferences.conference1.entity.props.id;
        
        it('Should delete conference', async () => {    
            const result = await request(app)
                                .delete(`/conference/${conferenceId}`)
                                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken());
                
            expect(result.status).toBe(204);
    
            const conferenceRepository = container.resolve('conferenceRepository') as ConferenceRepository;
            const fetchedConference = await conferenceRepository.findById(conferenceId);
            const bookingRepository = container.resolve('bookingRepository') as BookingRepository;
            const fetchedBookings = await bookingRepository.findByConferenceId(conferenceId);
    
            expect(fetchedConference).toBeNull();
            expect(fetchedBookings.length).toEqual(0);
        })
    })

    describe('Scenario: User is not authorized', () => {
        const conferenceId = e2eConferences.conference1.entity.props.id;

        it('Shloud return 403 Unauthorized', async () => {
            const result = await request(app)
                                .delete(`/conference/${conferenceId}`);
                
            expect(result.status).toBe(403);
        })
    })
})