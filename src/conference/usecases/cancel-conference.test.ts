import { testUser } from "../../user/tests/user-seed";

import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";
import { testConference } from "../tests/conference-seed";
import { testBooking } from "../tests/booking-seed";

import { CancelConference } from "./cancel-conference";

describe('Feature: Cancel conference', () => {
    let useCase: CancelConference;
    let repository: InMemoryConferenceRepository;
    let bookingRepository: InMemoryBookingRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConference.conference1);

        bookingRepository = new InMemoryBookingRepository();
        await bookingRepository.create(testBooking.aliceBooking);
        await bookingRepository.create(testBooking.bobBooking);

        useCase = new CancelConference(
            repository,
            bookingRepository,
        );
    })

    describe('Scenario: Happy path', () => {
        const conferenceId = testConference.conference1.props.id;
        const payload = {
            user: testUser.johnDoe,
            conferenceId
        }

        it('Should delete conference', async () => {
            await useCase.execute(payload);

            const fetchedConference = await repository.findById(conferenceId);
            const conferenceBookings = await bookingRepository.findByConferenceId(conferenceId);

            expect(fetchedConference).toBeNull();
            expect(conferenceBookings.length).toEqual(0);
        })
    })

    describe('Scenario: Delete conference of someone else', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.bob,
                conferenceId: testConference.conference1.props.id,
            })).rejects.toThrow('You are not allowed to delete this conference');
        })
    })
    
    describe('Scenario: Conference doesn\'t exist', () => {
        const payload = {
            user: testUser.johnDoe,
            conferenceId: 'non-existing-id',
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('Conference not found');
        })
    })
})