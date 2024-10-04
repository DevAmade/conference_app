export interface Executable<Req, Res> {
    execute(request: Req): Promise<Res>
}