import { User } from "../entities/user.entity";
import { UserRepository } from "../ports/user-repository.interface";

export class InMemorytUserRepository implements UserRepository {
    private users: User[] = [];

    async create(user: User): Promise<void> {
        this.users.push(user);
    }

    async findByEmailAddress(emailAddress: string): Promise<User | null> {
        const user = this.users.find(user => user.props.emailAddress === emailAddress);

        return user ?? null;
    }

    async findById(id: string): Promise<User | null> {
        const user = this.users.find(user => user.props.id === id);

        return user ?? null;
    }
}