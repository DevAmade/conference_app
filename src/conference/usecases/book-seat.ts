import { Executable } from "../../core/executable.interface";

import { User } from "../../user/entities/user.entity";

import { Booking } from "../entities/booking.entity";
import { BookingAlreadyExistsException } from "../exceptions/booking-already-exists-exception";
import { ConferenceIsFullException } from "../exceptions/conference-is-full-exception";
import { ConferenceNotFoundException } from "../exceptions/conference-not-found-exception";
import { BookingRepository } from "../ports/booking-repository.interface";
import { ConferenceRepository } from "../ports/conference-repository.interface";

type RequestBookSeat = {
    user: User,
    conferenceId: string,
}

type ResponseBookSeat = void;

export class BookSeat implements Executable<RequestBookSeat, ResponseBookSeat> {

    constructor(
        private readonly repository: ConferenceRepository,
        private readonly bookingRepository: BookingRepository
    ) {}
    
    async execute({ user, conferenceId }): Promise<void> {
        const conference = await this.repository.findById(conferenceId);
        
        if(!conference) {
            throw new ConferenceNotFoundException();
        }
        
        const fetchedBookings = await this.bookingRepository.findByConferenceId(conference.props.id);

        if(fetchedBookings.length >= conference.props.nbrSeat) {
            throw new ConferenceIsFullException();
        }

        const userBooking = fetchedBookings.find(book => book.props.userId === user.props.id);

        if(userBooking) {
            throw new BookingAlreadyExistsException();
        }

        const newBooking = new Booking({ userId: user.props.id, conferenceId });

        await this.bookingRepository.create(newBooking);
    }
}