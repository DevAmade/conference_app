import { Application } from 'express';
import request from 'supertest';

import { BookingRepository } from '../conference/ports/booking-repository.interface';

import container from '../infrastructure/express_api/config/dependency-injection';

import { TestApp } from './utils/test-app';
import { e2eUsers } from './seeds/user-seed';
import { e2eConferences } from './seeds/conference-seed';

describe('Feature: Book seat', () => {
    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadAllFixtures([
            e2eUsers.alice,
            e2eConferences.conference1
        ]);
        app = testApp.expressApp;
    })

    afterAll(async () => {
        await testApp.tearDown();
    })

    describe('Scenario: Happy path', () => {
        const conferenceId = e2eConferences.conference1.entity.props.id;
        const userId = e2eUsers.alice.entity.props.id;
        
        it('Should book seat', async () => {    
            const result = await request(app)
                                .post(`/conference/book/${conferenceId}`)
                                .set('Authorization', e2eUsers.alice.createAuthorizationToken());
                
            expect(result.status).toBe(201);
    
            const bookingRepository = container.resolve('bookingRepository') as BookingRepository;
            const fetchedBookings = await bookingRepository.findByConferenceId(conferenceId);
            const userBooking = fetchedBookings.find(book => book.props.userId === userId);
    
            expect(userBooking).toBeDefined();
        })
    })

    describe('Scenario: User is not authorized', () => {
        const conferenceId = e2eConferences.conference1.entity.props.id;

        it('Shloud return 403 Unauthorized', async () => {
            const result = await request(app)
                                .post(`/conference/book/${conferenceId}`);
                
            expect(result.status).toBe(403);
        })
    })
})