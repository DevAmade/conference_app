import { DateGenerator } from "../ports/date-generator.interface";

export class CurrentDateGenerator implements DateGenerator {
    
    now(): Date {
        return new Date();
    }
}