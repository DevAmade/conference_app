import { AwilixContainer } from "awilix";

import { ConferenceRepository } from "../../conference/ports/conference-repository.interface";
import { Conference } from "../../conference/entities/conference.entity";

import { Fixture } from "./fixture.interface";

export class ConferenceFixture implements Fixture {

    constructor(public entity: Conference) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('conferenceRepository') as ConferenceRepository;
        await repository.create(this.entity);
    }
}