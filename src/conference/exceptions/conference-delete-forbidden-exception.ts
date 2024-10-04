export class ConferenceDeleteForbiddenException extends Error {
    constructor() {
        super('You are not allowed to delete this conference');
    }
}