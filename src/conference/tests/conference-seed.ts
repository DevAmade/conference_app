import { addDays, addHours } from "date-fns";

import { testUser } from "../../user/tests/user-seed";

import { Conference } from "../entities/conference.entity";

export const testConference = {
    conference1: new Conference({ 
        id: 'id-1',
        organizerId: testUser.johnDoe.props.id,
        title: 'My first conference',
        startDate: addDays(new Date(), 4),
        endDate: addDays(addHours(new Date(), 2), 4),
        nbrSeat: 50
    }),
    conference2: new Conference({ 
        id: 'id-2',
        organizerId: testUser.bob.props.id,
        title: 'My second conference',
        startDate: addDays(new Date(), 6),
        endDate: addDays(addHours(new Date(), 2), 6),
        nbrSeat: 670
    }),
}