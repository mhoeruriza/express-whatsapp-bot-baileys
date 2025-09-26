import { WASocket } from '@whiskeysockets/baileys'

export const sockets: Record<string, WASocket> = {}

export function getSocket(userId: string): WASocket | null {
    return sockets[userId] ?? null
}

export function setSocket(userId: string, sock: WASocket) {
    sockets[userId] = sock
}

export function deleteSocket(userId: string) {
    delete sockets[userId]
}
