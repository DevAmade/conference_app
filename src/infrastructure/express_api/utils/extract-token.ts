export function extractToken(header: string): string | null {
    const [ type, token ] = header.split(' ');

    if(type !== 'Basic') {
        return null
    }

    return token;
}