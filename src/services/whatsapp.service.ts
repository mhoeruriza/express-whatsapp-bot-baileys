import { destroySession, initWhatsApp, setLogout } from '../utils/whatsapp.js'
import { AuthUser } from '../types/interfaceUser.js'
import User from '../models/user-model.js'
import { UserWhatsappStatus } from '../types/users.constants.js'
import { getSocket, setSocket } from '../utils/whatsapp.socket.js'
import { ValidateError } from '../utils/errors.js'
import WaSession from '../models/wa-sessions-model.js'
import { toWhatsAppJid } from '../utils/helpers.js'

//const sockets: Record<string, WASocket> = {}

export class WhatsAppService {
    static async startSession(user: AuthUser) {
        const existingSocket = getSocket(user.id)

        if (existingSocket) {
            const whatsappUser = await User.findByPk(user.id)
            if (whatsappUser?.whatsapp_status === UserWhatsappStatus.QR) {
                return {
                    whatsapp_status: whatsappUser.whatsapp_status,
                    qr: whatsappUser?.whatsapp_qrcode,
                }
            }

            return { whatsapp_status: whatsappUser?.whatsapp_status }
        }

        const sock = await initWhatsApp(user.id)
        setSocket(user.id, sock)

        return { whatsapp_status: UserWhatsappStatus.STARTING }
    }

    static async stopSession(user: AuthUser) {
        const socket = getSocket(user.id)

        if (!socket) {
            throw new ValidateError('WhatsApp session already logged out')
        }

        if (socket) {
            try {
                await socket.logout()
            } catch (err) {
                console.error(
                    `Error while stopping session for ${user.id}:`,
                    err
                )
            } finally {
                await destroySession(user.id)
                await setLogout(user.id)
                console.log(`🛑 [${user.id}] WhatsApp session stopped`)
            }
        }
        return { whatsapp_status: UserWhatsappStatus.LOGOUT }
    }

    static async qrcode(user: AuthUser) {
        const existingSocket = getSocket(user.id)

        let status, qr

        if (existingSocket) {
            const whatsappUser = await User.findByPk(user.id)
            status = whatsappUser?.whatsapp_status
            if (whatsappUser?.whatsapp_status === UserWhatsappStatus.QR) {
                qr = whatsappUser?.whatsapp_qrcode
            }
        } else {
            throw new ValidateError('WhatsApp session not started')
        }

        return { whatsapp_status: status, qr }
    }

    static async whatsappToken(user: AuthUser) {
        const existingSocket = getSocket(user.id)
        if (!existingSocket) {
            throw new ValidateError('WhatsApp session not started')
        }

        const whatsappSession = await WaSession.findOne({
            where: { user_id: user.id },
        })

        if (!whatsappSession) {
            throw new ValidateError('Please scan QR code to login to WhatsApp')
        }

        const { whatsapp_keys } = whatsappSession

        const allowedStatuses = [
            null,
            UserWhatsappStatus.LOGOUT,
            UserWhatsappStatus.STARTING,
        ]

        if (allowedStatuses.includes(whatsapp_keys as any)) {
            // Selain itu, berarti user harus scan QR
            throw new ValidateError('Please scan QR code to login to WhatsApp')
        }

        return { whatsapp_token: whatsapp_keys || null }
    }

    static async sendMessage(whatsappApiKey: any, to: string, message: string) {
        const waSession = await WaSession.findOne({
            where: { whatsapp_keys: whatsappApiKey },
        })

        if (!waSession) {
            throw new ValidateError(
                'Scan QR code to login to WhatsApp or Invalid WhatsApp token'
            )
        }

        const existingSocket = getSocket(waSession.user_id)
        if (!existingSocket) {
            throw new ValidateError('WhatsApp session not started')
        }

        const jid = toWhatsAppJid(to)
        await existingSocket.sendMessage(jid, { text: message })
    }
}
