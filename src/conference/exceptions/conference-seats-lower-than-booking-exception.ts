export class ConferenceSeatsLowerThanBookingException extends Error {
    constructor() {
        super('The number of seats is less than the number of reservations');
    }
}