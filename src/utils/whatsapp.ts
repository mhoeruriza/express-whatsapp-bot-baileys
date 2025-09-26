import makeWASocket, {
    DisconnectReason,
    proto,
    WASocket,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { useDbAuthState } from './whatsappAuthState.js'
import User from '../models/user-model.js'
import { UserWhatsappStatus } from '../types/users.constants.js'
import WaSession from '../models/wa-sessions-model.js'
import { deleteSocket } from './whatsapp.socket.js'

export async function initWhatsApp(userId: string): Promise<WASocket> {
    const { state, saveCreds } = await useDbAuthState(userId)

    const sock = makeWASocket({ auth: state })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            setQR(userId, qr)
            console.log(`QR RECEIVED [userId: ${userId}]: ${qr}`)
        }

        if (connection === 'close') {
            const errorCode = (lastDisconnect?.error as Boom)?.output
                ?.statusCode
            console.log('❌ Disconnected with code:', errorCode)

            if (
                errorCode === DisconnectReason.loggedOut ||
                errorCode === 401 // device removed
            ) {
                console.log(`🚪 [${userId}] Logged out from device`)
                setLogout(userId)
                destroySession(userId) // hapus session biar QR baru
                return
            }

            // selain logout, coba reconnect
            console.log(`🔄 [${userId}] Reconnecting...`)
            initWhatsApp(userId)
        } else if (connection === 'open') {
            setReady(userId)

            sock.ev.on('messages.upsert', async (m) => {
                const msg = m.messages[0]
                if (!msg.key.fromMe && msg.message) {
                    //setMessage(userId, JSON.stringify(msg.message))
                    await handleIncomingMessage(sock, msg)
                }
            })
            console.log(`✅ [${userId}] WhatsApp is connected OK`)
        }
    })

    // 👉 tambahan: handle error di websocket biar ga bikin crash
    sock.ws.on('error', (err: any) => {
        console.error(`🔥 [${userId}] WebSocket error:`, err.message || err)
    })

    /*
    sock.ev.on('messaging-history.set', (m) => {
        console.log(
            `📥 Sync user ${userId}: ${m.chats.length} chat, ${m.messages.length} pesan`
        )
    })*/

    return sock
}

export function extractTextMessage(msg: proto.IWebMessageInfo): string | null {
    if (msg.message?.conversation) return msg.message.conversation
    if (msg.message?.extendedTextMessage?.text)
        return msg.message.extendedTextMessage.text
    if (msg.message?.imageMessage?.caption)
        return msg.message.imageMessage.caption
    return null
}

export const handleIncomingMessage = async (sock: any, msg: any) => {
    const text = extractTextMessage(msg)

    if (!text) return

    let reply = `Anda mengirim pesan: ${text}`

    if (text.toLowerCase() === 'ping') {
        reply = 'pong'
    } else if (text.toLowerCase() === 'halo') {
        reply = 'Halo, saya bot 🤖'
    } else if (text.toLowerCase() === 'logout') {
        await sock.ws.close()
    }

    await sock.sendMessage(msg.key.remoteJid!, { text: reply })
}

async function setQR(userId: string, qr: string) {
    await User.update(
        {
            whatsapp_status: UserWhatsappStatus.QR,
            whatsapp_qrcode: qr,
        },
        { where: { id: userId } }
    )
}

async function setReady(userId: string) {
    await User.update(
        {
            whatsapp_status: UserWhatsappStatus.READY,
            whatsapp_qrcode: null,
        },
        { where: { id: userId } }
    )
}

export async function setLogout(userId: string) {
    await User.update(
        {
            whatsapp_status: UserWhatsappStatus.LOGOUT,
            whatsapp_qrcode: null,
        },
        { where: { id: userId } }
    )
}

export async function destroySession(userId: string) {
    deleteSocket(userId)
    await WaSession.destroy({ where: { user_id: userId } })
}
