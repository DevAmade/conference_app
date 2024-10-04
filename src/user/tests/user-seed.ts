import { User } from "../entities/user.entity";

export const testUser = {
    johnDoe: new User({
        id: 'johnDoe',
        emailAddress: 'johndoe@gmail.com',
        password: 'azerty'
    }),
    bob: new User({
        id: 'bob',
        emailAddress: 'bob@gmail.com',
        password: 'azerty'
    }),
    alice: new User({
        id: 'alice',
        emailAddress: 'alice@gmail.com',
        password: 'azerty'
    }),
}