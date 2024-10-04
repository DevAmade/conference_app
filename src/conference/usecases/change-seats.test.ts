import { testUser } from "../../user/tests/user-seed";

import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";
import { testConference } from "../tests/conference-seed";
import { Booking } from "../entities/booking.entity";

import { ChangeSeats } from "./change-seats";

describe('Feature: Changing the number of seats', () => {
    async function expectSeatsUnchanged() {
        const fetchedConference = await repository.findById(testConference.conference1.props.id);

        expect(fetchedConference?.props.nbrSeat).toEqual(50);
    }
    
    let repository: InMemoryConferenceRepository;
    let bookingRepository: InMemoryBookingRepository;
    let useCase: ChangeSeats;

    beforeEach(async () => {
        repository = new InMemoryConferenceRepository();
        await repository.create(testConference.conference1);
        bookingRepository = new InMemoryBookingRepository();
        useCase = new ChangeSeats(repository, bookingRepository);
    })

    describe('Scenario: Happy path', () => {
        it('Should change the number of seats', async () => {
            await useCase.execute({
                user: testUser.johnDoe,
                conferenceId: 'id-1',
                nbrSeat: 100
            });
    
            const fetchedConference = await repository.findById(testConference.conference1.props.id);
    
            expect(fetchedConference!.props.nbrSeat).toEqual(100);
        })
    })

    describe('Scenario: Conference doesn\'t exist', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: 'non-existing-id',
                nbrSeat: 100
            })).rejects.toThrow('Conference not found');

            await expectSeatsUnchanged();
        })
    })

    describe('Scenario: Update conference of someone else', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.bob,
                conferenceId: testConference.conference1.props.id,
                nbrSeat: 100
            })).rejects.toThrow('You are not allowed to update this conference');
            
            await expectSeatsUnchanged();
        })
    })

    describe('Scenario: Number of seats > 1000', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                nbrSeat: 1001
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and minimum of 20 seats');

            await expectSeatsUnchanged();
        })
    })

    describe('Scenario: Number of seats < 20', () => {
        it('Should fail', async () => {
            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                nbrSeat: 19
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and minimum of 20 seats');

            await expectSeatsUnchanged();
        })
    })

    describe('Scenario: The number of seats is less than the number of reservations', () => {
        it('Should fail', async () => {
            const nbrBooking = 30;
            const newNbrSeat = 25;

            for(let i = 0; i < nbrBooking; i++) {
                const newBooking = new Booking({
                    userId: `user-id-${i}`,
                    conferenceId: testConference.conference1.props.id
                });

                await bookingRepository.create(newBooking);
            }

            await expect(useCase.execute({
                user: testUser.johnDoe,
                conferenceId: testConference.conference1.props.id,
                nbrSeat: newNbrSeat
            })).rejects.toThrow('The number of seats is less than the number of reservations');

            await expectSeatsUnchanged();
        })
    })
})