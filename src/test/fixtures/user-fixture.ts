import { AwilixContainer } from "awilix";

import { User } from "../../user/entities/user.entity";
import { UserRepository } from "../../user/ports/user-repository.interface";

import { Fixture } from "./fixture.interface";

export class UserFixture implements Fixture {

    constructor(public entity: User) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('userRepository') as UserRepository;
        await repository.create(this.entity);
    }

    createAuthorizationToken(): string {
        return `Basic ${Buffer.from(`${this.entity.props.emailAddress}:${this.entity.props.password}`).toString('base64')}`;
    }
}