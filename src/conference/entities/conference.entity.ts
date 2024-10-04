import { differenceInDays, differenceInHours } from "date-fns";

import { Entity } from "../../core/entities/entity";

export type ConferenceProps = {
    id: string,
    organizerId: string,
    title: string,
    startDate: Date,
    endDate: Date,
    nbrSeat: number
};

export class Conference extends Entity<ConferenceProps> {

    isTooClose(now: Date): boolean {
        return differenceInDays(this.props.startDate, now) < 3;
    }

    hasTooManySeats(): boolean {
        return this.props.nbrSeat > 1000;
    }

    hasNotEnoughSeats(): boolean {
        return this.props.nbrSeat < 20;
    }

    isTooLong(): boolean {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3;
    }
}