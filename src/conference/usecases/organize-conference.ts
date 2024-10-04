import { DomainException } from "../../core/exceptions/domain-exception";
import { Executable } from "../../core/executable.interface";
import { DateGenerator } from "../../core/ports/date-generator.interface";
import { IDGenerator } from "../../core/ports/id-generator.interface";

import { User } from "../../user/entities/user.entity";

import { Conference } from "../entities/conference.entity";
import { ConferenceRepository } from "../ports/conference-repository.interface";

type OrganizeRequest = {
    user: User,
    title: string,
    startDate: Date,
    endDate: Date,
    nbrSeat: number
};

type OrganizeResponse = {
    id: string
};

export class OrganizeConference implements Executable<OrganizeRequest, OrganizeResponse> {

    constructor(
        private readonly repository: ConferenceRepository,
        private readonly idGenerator: IDGenerator,
        private readonly dateGenerator: DateGenerator,
    ) {}
    
    public async execute({ user, title, startDate, endDate, nbrSeat }) {
        const id = this.idGenerator.generate();

        const newConference = new Conference({
            id,
            organizerId: user.props.id,
            title: title,
            startDate: startDate,
            endDate: endDate,
            nbrSeat
        });

        if(newConference.isTooClose(this.dateGenerator.now())) {
            throw new DomainException('The conference must happen in at least 3 days');
        }

        if(newConference.hasTooManySeats()) {
            throw new DomainException('The conference must have a maximum of 1000 seats');
        }

        if(newConference.hasNotEnoughSeats()) {
            throw new DomainException('The conference must have a minimum of 20 seats');
        }

        if(newConference.isTooLong()) {
            throw new DomainException('The conference must be no longer than 3 hours');
        }

        await this.repository.create(newConference);

        return { id: newConference.props.id };
    }
}