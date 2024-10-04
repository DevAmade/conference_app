import { AwilixContainer } from "awilix";

export interface Fixture {
    load(container: AwilixContainer): Promise<void>
}