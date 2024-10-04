import { Booking } from "../entities/booking.entity";

export interface BookingRepository {
    
    deleteMany(conferenceId: string): Promise<void>
    create(booking: Booking): Promise<void>
    findByConferenceId(id: string): Promise<Booking[]>
}