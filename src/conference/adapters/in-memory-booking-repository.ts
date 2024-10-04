import { Booking } from "../entities/booking.entity";
import { BookingRepository } from "../ports/booking-repository.interface";

export class InMemoryBookingRepository implements BookingRepository {
    public database: Booking[] = [];

    async create(booking: Booking): Promise<void> {
        this.database.push(booking);
    }

    async findByConferenceId(id: string): Promise<Booking[]> {
        return this.database.filter(booking => booking.props.conferenceId === id);
    }
}