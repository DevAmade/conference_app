import { DateGenerator } from "../ports/date-generator.interface";

export class FixedDateGenerator implements DateGenerator {
    
    now(): Date {
        return new Date('2024-01-01T00:00:00.000Z');
    }
}