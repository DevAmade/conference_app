import { Email, Mailer } from "../ports/mailer.interface";

export class InMemoryMailer implements Mailer {
    public readonly sentEmails: Email[] = [];

    async send(email: Email): Promise<void> {
        this.sentEmails.push(email);
    }
}