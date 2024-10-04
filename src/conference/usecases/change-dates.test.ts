import { addDays, addHours } from "date-fns";

import { testUser } from "../../user/tests/user-seed";
import { InMemorytUserRepository } from "../../user/adapters/in-memory-user-repository";

import { FixedDateGenerator } from "../../core/adapters/fixed-date-generator";
import { InMemoryMailer } from "../../core/adapters/in-memory-mailer";

import { testConference } from "../tests/conference-seed";
import { testBooking } from "../tests/booking-seed";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";

import { ChangeDates } from "./change-dates";

describe('Feature: change the dates of conference', () => {
    async function expectDatesRemainUnchanged() {
        const conference = await repository.findById(testConference.conference1.props.id);

        expect(conference?.props.startDate).toEqual(testConference.conference1.props.startDate);
        expect(conference?.props.endDate).toEqual(testConference.conference1.props.endDate);
    }

    let useCase: ChangeDates;
    let repository: InMemoryConferenceRepository;
    let dateGenerator: FixedDateGenerator;
    let bookingRepository: InMemoryBookingRepository;
    let mailer: InMemoryMailer;
    let userRepository: InMemorytUserRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConference.conference1);

        dateGenerator = new FixedDateGenerator();

        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.bobBooking);
        await bookingRepository.create(testBooking.aliceBooking);

        mailer = new InMemoryMailer();
        
        userRepository = new InMemorytUserRepository();
        await userRepository.create(testUser.bob);
        await userRepository.create(testUser.alice);

        useCase = new ChangeDates(
            repository,
            dateGenerator,
            bookingRepository,
            mailer,
            userRepository
        );
    })

    describe('Scenario: Happy path', () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate
        }

        it('Should change the dates', async () => {
            await useCase.execute(payload);

            const fetchedConference = await repository.findById(testConference.conference1.props.id);

            expect(fetchedConference?.props.startDate).toEqual(startDate);
            expect(fetchedConference?.props.endDate).toEqual(endDate);
        })

        it('Should send an email to the participants', async () => {
            await useCase.execute(payload);

            expect(mailer.sentEmails).toEqual([{
                from: 'TEDx conference',
                to: testUser.bob.props.emailAddress,
                subject: `The date of the conference: ${testConference.conference1.props.title}, have changed`,
                body: `The date of the conference: ${testConference.conference1.props.title}, have changed`
            }, {
                from: 'TEDx conference',
                to: testUser.alice.props.emailAddress,
                subject: `The date of the conference: ${testConference.conference1.props.title}, have changed`,
                body: `The date of the conference: ${testConference.conference1.props.title}, have changed`
            }])
        })
    })
    
    describe('Scenario: Conference doesn\'t exist', () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const payload = {
            user: testUser.johnDoe,
            conferenceId: 'non-existing-id',
            startDate,
            endDate
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('Conference not found');

            await expectDatesRemainUnchanged();
        })
    })

    describe('Scenario: Update conference of someone else', () => {
        const startDate = addDays(new Date(), 8);
        const endDate = addDays(addHours(new Date(), 2), 4);
        const payload = {
            user: testUser.bob,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('You are not allowed to update this conference');

            await expectDatesRemainUnchanged();
        })
    })

    describe('Scenario: The new start date is too close', () => {
        const startDate = new Date('2024-01-02T00:00:00.000Z');
        const endDate = new Date('2024-01-02T01:00:00.000Z');
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must happen in at least 3 days');

            await expectDatesRemainUnchanged();
        })
    })

    describe('Scenario: The updated conference is too long', () => {
        const startDate = new Date('2024-01-04T00:00:00.000Z');
        const endDate = new Date('2024-01-04T05:00:00.000Z');
        const payload = {
            user: testUser.johnDoe,
            conferenceId: testConference.conference1.props.id,
            startDate,
            endDate
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('The conference must be no longer than 3 hours');

            await expectDatesRemainUnchanged();
        })
    })
})