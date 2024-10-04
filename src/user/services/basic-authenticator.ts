import { User } from "../entities/user.entity";
import { Authenticator } from "../ports/authenticator.interface";
import { UserRepository } from "../ports/user-repository.interface";

export class BasicAuthenticator implements Authenticator {
    
    constructor(
        private readonly repository: UserRepository,
    ) {}
    
    async authenticate(token: string): Promise<User> {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [ emailAddress, password ] = decoded.split(':');

        const user = await this.repository.findByEmailAddress(emailAddress);

        if(!user || user.props.password !== password) {
            throw new Error('Wrong credentials');
        }
        
        return user;
    }
}