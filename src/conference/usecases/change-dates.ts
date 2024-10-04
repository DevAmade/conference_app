import { DomainException } from "../../core/exceptions/domain-exception";
import { Executable } from "../../core/executable.interface";
import { DateGenerator } from "../../core/ports/date-generator.interface";
import { Mailer } from "../../core/ports/mailer.interface";

import { User } from "../../user/entities/user.entity";
import { UserRepository } from "../../user/ports/user-repository.interface";

import { Conference } from "../entities/conference.entity";
import { ConferenceNotFoundException } from "../exceptions/conference-not-found-exception";
import { ConferenceUpdateForbiddenException } from "../exceptions/conference-update-forbidden-exception";
import { BookingRepository } from "../ports/booking-repository.interface";
import { ConferenceRepository } from "../ports/conference-repository.interface";

type RequestChangeDates = {
    user: User,
    conferenceId: string,
    startDate: Date,
    endDate: Date
}

type ResponseChangeDates = void;

export class ChangeDates implements Executable<RequestChangeDates, ResponseChangeDates> {

    constructor(
        private readonly repository: ConferenceRepository,
        private readonly dateGenerator: DateGenerator,
        private readonly bookingRepository: BookingRepository,
        private readonly mailer: Mailer,
        private readonly userRepository: UserRepository,
    ) {}
    
    async execute({ user, conferenceId, startDate, endDate }): Promise<void> {
        const conference = await this.repository.findById(conferenceId);

        if(!conference) throw new ConferenceNotFoundException();

        if(conference.props.organizerId !== user.props.id) {
            throw new ConferenceUpdateForbiddenException();
        }

        conference.update({ startDate, endDate });

        if(conference.isTooClose(this.dateGenerator.now())) {
            throw new DomainException('The conference must happen in at least 3 days');
        }

        if(conference.isTooLong()) {
            throw new DomainException('The conference must be no longer than 3 hours');
        }

        await this.repository.update(conference);
        await this.sendEmailToParticipants(conference);
    }

    async sendEmailToParticipants(conference: Conference): Promise<void> {
        const booking = await this.bookingRepository.findByConferenceId(conference.props.id);
        const users = await Promise.all(booking.map(booking => this.userRepository.findById(booking.props.userId))
                                               .filter(user => user !== null)) as User[];

        await Promise.all(
            users.map(user => {
                this.mailer.send({
                    from: 'TEDx conference',
                    to: user.props.emailAddress,
                    subject: `The date of the conference: ${conference.props.title}, have changed`,
                    body: `The date of the conference: ${conference.props.title}, have changed`
                })
            })
        )
    }
}