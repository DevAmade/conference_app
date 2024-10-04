import { Entity } from "../../core/entities/entity"

export type BookingProps = {
    userId: string,
    conferenceId: string
};

export class Booking extends Entity<BookingProps> {

}