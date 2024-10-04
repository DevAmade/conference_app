export class ConferenceIsFullException extends Error {
    constructor() {
        super('Conference is full');
    }
}