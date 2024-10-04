import { testUser } from "../../user/tests/user-seed";

import { Booking } from "../entities/booking.entity";
import { testConference } from "../tests/conference-seed";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";

import { BookSeat } from "./book-seat";

describe('Feature: Book seat', () => {
    let useCase: BookSeat;
    let repository: InMemoryConferenceRepository;
    let bookingRepository: InMemoryBookingRepository;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConference.conference1);

        bookingRepository = new InMemoryBookingRepository();

        useCase = new BookSeat(
            repository,
            bookingRepository,
        );
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            user: testUser.alice,
            conferenceId: testConference.conference1.props.id,
        }

        it('Should book seat', async () => {
            await useCase.execute(payload);

            const fetchedBookings = await bookingRepository.findByConferenceId(testConference.conference1.props.id);

            const userBooking = fetchedBookings.find(book => book.props.userId === testUser.alice.props.id);

            expect(userBooking).toBeDefined();
        })
    })

    describe('Scenario: Booking already exists', () => {
        const payload = {
            user: testUser.alice,
            conferenceId: testConference.conference1.props.id,
        }
        const alreadyExistsBooking = new Booking({
            userId: testUser.alice.props.id,
            conferenceId: testConference.conference1.props.id
        });

        it('Should fail', async () => {
            await bookingRepository.create(alreadyExistsBooking);
            await expect(useCase.execute(payload)).rejects.toThrow('Booking already exists');
        })
    })

    describe('Scenario: Conference is full', () => {
        const payload = {
            user: testUser.alice,
            conferenceId: testConference.conference1.props.id,
        }

        it('Should fail', async () => {
            for(let i = 0; i < testConference.conference1.props.nbrSeat; i++) {
                const newBooking = new Booking({
                    userId: `user-id-${i}`,
                    conferenceId: testConference.conference1.props.id
                });

                await bookingRepository.create(newBooking);
            }

            await expect(useCase.execute(payload)).rejects.toThrow('Conference is full');
        })
    })
    
    describe('Scenario: Conference doesn\'t exist', () => {
        const payload = {
            user: testUser.alice,
            conferenceId: 'non-existing-id',
        }

        it('Should fail', async () => {
            await expect(useCase.execute(payload)).rejects.toThrow('Conference not found');
        })
    })
})