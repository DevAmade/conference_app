import { AwilixContainer } from "awilix";

import { Booking } from "../../conference/entities/booking.entity";
import { BookingRepository } from "../../conference/ports/booking-repository.interface";

import { Fixture } from "./fixture.interface";

export class BookingFixture implements Fixture {

    constructor(public entity: Booking) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('bookingRepository') as BookingRepository;
        await repository.create(this.entity);
    }
}