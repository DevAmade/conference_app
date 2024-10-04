export class BookingAlreadyExistsException extends Error {
    constructor() {
        super('Booking already exists');
    }
}