export type Email = {
    from: string,
    to: string,
    subject: string,
    body: string
};

export interface Mailer {
    send(email: Email): Promise<void>
}