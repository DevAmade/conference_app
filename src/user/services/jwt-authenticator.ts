import jwt from 'jsonwebtoken';

import { User } from "../entities/user.entity";
import { Authenticator } from "../ports/authenticator.interface";
import { UserRepository } from "../ports/user-repository.interface";

export const SECRET_KEY = 'My super secret key';

export class JwtAuthenticator implements Authenticator {
    
    constructor(
        private readonly repository: UserRepository,
    ) {}
    
    async authenticate(token: string): Promise<User> {
        const verify = jwt.verify(token, SECRET_KEY);

        const user = await this.repository.findById((verify as any).userId);
        
        if(!user) {
            throw new Error('invalid signature');
        }

        return user;
    }
}