import { DomainException } from "../../core/exceptions/domain-exception";
import { Executable } from "../../core/executable.interface";

import { User } from "../../user/entities/user.entity";

import { ConferenceNotFoundException } from "../exceptions/conference-not-found-exception";
import { ConferenceSeatsLowerThanBookingException } from "../exceptions/conference-seats-lower-than-booking-exception";
import { ConferenceUpdateForbiddenException } from "../exceptions/conference-update-forbidden-exception";
import { BookingRepository } from "../ports/booking-repository.interface";
import { ConferenceRepository } from "../ports/conference-repository.interface";

type RequestChangeSeats = {
    user: User,
    conferenceId: string,
    nbrSeat: number
}

type ResponseChangeSeats = void;

export class ChangeSeats implements Executable<RequestChangeSeats, ResponseChangeSeats> {
    constructor(
        private readonly repository: ConferenceRepository,
        private readonly bookingRepository: BookingRepository,
    ) {}

    async execute({ user, conferenceId, nbrSeat }) {
        const conference = await this.repository.findById(conferenceId);

        if(!conference) {
            throw new ConferenceNotFoundException();
        }

        if(conference.props.organizerId !== user.props.id) {
            throw new ConferenceUpdateForbiddenException();
        }

        conference.update({ nbrSeat });

        if(conference.hasNotEnoughSeats() || conference.hasTooManySeats()) {
            throw new DomainException('The conference must have a maximum of 1000 seats and minimum of 20 seats');
        }

        const fetchedBookings = await this.bookingRepository.findByConferenceId(conference.props.id);

        if(fetchedBookings.length > nbrSeat) {
            throw new ConferenceSeatsLowerThanBookingException();
        }

        await this.repository.update(conference);
    }
}