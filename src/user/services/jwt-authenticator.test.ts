import jwt from 'jsonwebtoken';

import { InMemorytUserRepository } from "../adapters/in-memory-user-repository";
import { testUser } from "../tests/user-seed";

import { JwtAuthenticator, SECRET_KEY } from "./jwt-authenticator";

describe('Authentication', () => {
    let repository: InMemorytUserRepository;
    let authenticator: JwtAuthenticator;

    beforeEach(async () => {
        repository = new InMemorytUserRepository();
        await repository.create(testUser.johnDoe);
        authenticator = new JwtAuthenticator(repository);
    })

    describe('Scenario: Token is valid', () => {
        it('Should return a user', async () => {
            const payload = {
                userId: testUser.johnDoe.props.id,
                userEmailAddress: testUser.johnDoe.props.emailAddress
            }

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

            const authenticator = new JwtAuthenticator(repository);
            const user = await authenticator.authenticate(token);
    
            expect(user.props).toEqual({
                id: 'johnDoe',
                emailAddress: 'johndoe@gmail.com',
                password: 'azerty'
            });
        })
    })

    describe('Scenario: Token is invalid', () => {
        it('Should throw an error', async () => {
            const payload = {
                userId: testUser.johnDoe.props.id,
                userEmailAddress: testUser.johnDoe.props.emailAddress
            }

            const token = jwt.sign(payload, 'WRONG_SECRET_KEY', { expiresIn: '1d' });

            const authenticator = new JwtAuthenticator(repository);
    
            await expect(authenticator.authenticate(token)).rejects.toThrow('invalid signature');
        })
    })
})