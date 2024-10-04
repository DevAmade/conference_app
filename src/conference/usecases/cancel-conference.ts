import { Executable } from "../../core/executable.interface";

import { User } from "../../user/entities/user.entity";

import { ConferenceNotFoundException } from "../exceptions/conference-not-found-exception";
import { ConferenceDeleteForbiddenException } from "../exceptions/conference-delete-forbidden-exception";
import { BookingRepository } from "../ports/booking-repository.interface";
import { ConferenceRepository } from "../ports/conference-repository.interface";

type RequestCancelConference = {
    user: User,
    conferenceId: string,
}

type ResponseCancelConference = void;

export class CancelConference implements Executable<RequestCancelConference, ResponseCancelConference> {

    constructor(
        private readonly repository: ConferenceRepository,
        private readonly bookingRepository: BookingRepository
    ) {}
    
    async execute({ user, conferenceId }): Promise<void> {
        const conference = await this.repository.findById(conferenceId);

        if(!conference) {
            throw new ConferenceNotFoundException();
        }

        if(conference.props.organizerId !== user.props.id) {
            throw new ConferenceDeleteForbiddenException();
        }

        await this.bookingRepository.deleteMany(conferenceId);
        await this.repository.delete(conferenceId);
    }
}