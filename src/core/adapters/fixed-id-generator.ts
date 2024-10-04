import { IDGenerator } from "../ports/id-generator.interface";

export class FixedIdGenerator implements IDGenerator {
    
    public generate(): string {
        return 'id-1';
    }
}