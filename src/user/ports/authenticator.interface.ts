import { User } from "../entities/user.entity";

export interface Authenticator {

    authenticate(token: string): Promise<User>
}