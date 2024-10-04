import { InMemorytUserRepository } from "../adapters/in-memory-user-repository";
import { User } from "../entities/user.entity";

import { BasicAuthenticator } from "./basic-authenticator";

describe('Authentication', () => {
    let repository: InMemorytUserRepository;
    let authenticator: BasicAuthenticator;

    beforeEach(async () => {
        repository = new InMemorytUserRepository();
        await repository.create(new User({
            id: 'johnDoe',
            emailAddress: 'johndoe@gmail.com',
            password: 'azerty'
        }));
        authenticator = new BasicAuthenticator(repository);
    })

    describe('Scenario: Token is valid', () => {
        it('Should return a user', async () => {
            const payload = Buffer.from('johndoe@gmail.com:azerty').toString('base64'); //am9obmRvZUBnbWFpbC5jb206YXplcnR5
            const authenticator = new BasicAuthenticator(repository);
            const user = await authenticator.authenticate(payload);
    
            expect(user.props).toEqual({
                id: 'johnDoe',
                emailAddress: 'johndoe@gmail.com',
                password: 'azerty'
            });
        })
    })

    describe('Scenario: Email is invalid', () => {
        it('Should throw an error', async () => {
            const payload = Buffer.from('unknown@gmail.com:azerty').toString('base64');
            const authenticator = new BasicAuthenticator(repository);
    
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials');
        })
    })

    describe('Scenario: Password is invalid', () => {
        it('Should throw an error', async () => {
            const payload = Buffer.from('johndoe@gmail.com:wrongPassword').toString('base64');
            const authenticator = new BasicAuthenticator(repository);
    
            await expect(authenticator.authenticate(payload)).rejects.toThrow('Wrong credentials');
        })
    })
})