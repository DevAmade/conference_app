export function extractToken(header: string): string | null {
    const [ type, token ] = header.split(' ');

    if(type !== 'Bearer') {
        return null
    }

    return token;
}