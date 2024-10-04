import jwt from 'jsonwebtoken';
import { AwilixContainer } from "awilix";

import { User } from "../../user/entities/user.entity";
import { SECRET_KEY } from '../../user/services/jwt-authenticator';
import { UserRepository } from "../../user/ports/user-repository.interface";

import { Fixture } from "./fixture.interface";

export class UserFixture implements Fixture {

    constructor(public entity: User) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('userRepository') as UserRepository;
        await repository.create(this.entity);
    }

    createAuthorizationToken(): string {
        const payload = {
            userId: this.entity.props.id,
            userEmailAddress: this.entity.props.emailAddress
        }

        return `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })}`;
    }
}