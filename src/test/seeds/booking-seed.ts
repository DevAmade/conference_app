import { Booking } from "../../conference/entities/booking.entity";
import { testConference } from "../../conference/tests/conference-seed";

import { BookingFixture } from "../fixtures/booking-fixture";

import { e2eUsers } from "./user-seed";

export const e2eBookings = {
    bobBooking: new BookingFixture(
        new Booking({
            userId: e2eUsers.bob.entity.props.id,
            conferenceId:  testConference.conference1.props.id
        })
    ),
    aliceBooking: new BookingFixture(
        new Booking({
            userId: e2eUsers.alice.entity.props.id,
            conferenceId:  testConference.conference1.props.id
        })
    )
}