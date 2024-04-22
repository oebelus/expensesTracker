import { generateKeys } from './utils';

export const sessions: Record<
    string,
    { sessionId: string; email: string; valid: boolean}
> = {}

export function createSession(email: string, name: string) {
    let sessionId: string = generateKeys()

    while (!sessions[sessionId]) {
        sessionId = generateKeys()
    }

    const session = { sessionId, email, valid: true, name }

    sessions[sessionId] = session
    return session
}

export function getSession(sessionId: string) {
    const session = sessions[sessionId]
    return session && session.valid ? session : null
}

export function invalidateSession(sessionId: string) {
    const session = sessions[sessionId]

    if (session)
        sessions[sessionId].valid = false

    return sessions[sessionId]
}