import { Booking } from "../entities/booking.entity";

export interface BookingRepository {
    create(booking: Booking): Promise<void>
    findByConferenceId(id: string): Promise<Booking[]>
}