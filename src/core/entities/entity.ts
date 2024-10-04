export abstract class Entity<P> {
    public initialState: P
    public props: P

    constructor(public data: P) {
        this.initialState = { ...data };
        this.props = { ...data };

        Object.freeze(this.initialState);
    }

    update(data: Partial<P>): void {
        this.props = { ...this.props, ...data }
    }

    commit(): void {
        this.initialState = { ...this.props }
    }
}