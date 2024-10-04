import { v4 as UuidV4 } from 'uuid';

import { IDGenerator } from '../ports/id-generator.interface';

export class RandomIdGenerator implements IDGenerator {
    generate(): string {
        return UuidV4();
    }
}