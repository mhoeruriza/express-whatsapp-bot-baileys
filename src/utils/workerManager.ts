import { WASocket } from '@whiskeysockets/baileys'
import { initWhatsApp } from '../utils/whatsapp.js'
import WaSession from '../models/wa-sessions-model.js'

type UserStatus =
    | { type: 'STARTING'; updatedAt: number }
    | { type: 'QR'; qr: string; updatedAt: number }
    | { type: 'READY'; updatedAt: number }
    | { type: 'MESSAGE'; message: string; updatedAt: number }
    | { type: 'LOGOUT'; updatedAt: number }

const sockets: Record<string, WASocket> = {}
const statusStore: Record<string, UserStatus | null> = {}

export async function startSession(userId: string) {
    if (sockets[userId]) return sockets[userId]

    setStarting(userId)
    const sock = await initWhatsApp(userId)
    sockets[userId] = sock
    return sock
}

export async function stopSession(userId: string) {
    const socket = sockets[userId]
    if (socket) {
        delete sockets[userId]
        socket.logout()
        await WaSession.destroy({ where: { user_id: userId } })
        console.log(`🛑 [${userId}] WhatsApp session stopped`)
    }
    return statusStore[userId] ?? null
}

export function getStatus(userId: string) {
    return statusStore[userId] ?? null
}

export function getSocket(userId: string) {
    return sockets[userId] ?? null
}

// ----------------------
// ✅ Factory Functions
// ----------------------
export function setStarting(userId: string) {
    statusStore[userId] = { type: 'STARTING', updatedAt: Date.now() }
}

export function setQr(userId: string, qr: string) {
    statusStore[userId] = { type: 'QR', qr, updatedAt: Date.now() }
}

export function setMessage(userId: string, message: string) {
    statusStore[userId] = { type: 'MESSAGE', message, updatedAt: Date.now() }
}

export function setReady(userId: string) {
    statusStore[userId] = { type: 'READY', updatedAt: Date.now() }
}

export function setLogout(userId: string) {
    statusStore[userId] = { type: 'LOGOUT', updatedAt: Date.now() }
}
