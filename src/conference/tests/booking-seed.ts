import { testUser } from "../../user/tests/user-seed";

import { Booking } from "../entities/booking.entity";

import { testConference } from "./conference-seed";

export const testBooking = {
    bobBooking: new Booking({
        userId: testUser.bob.props.id,
        conferenceId: testConference.conference1.props.id
    }),
    aliceBooking: new Booking({
        userId: testUser.alice.props.id,
        conferenceId: testConference.conference1.props.id
    })
}