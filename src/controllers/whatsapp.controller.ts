import { Request, Response } from 'express'
import { responseError, responseSuccess } from '../utils/response.js'
import { WhatsAppService } from '../services/whatsapp.service.js'

export class WAController {
    static async startSession(req: Request, res: Response) {
        try {
            const result = await WhatsAppService.startSession(req.user)
            return responseSuccess(
                res,
                'WhatsApp session started successfully',
                result
            )
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async stopSession(req: Request, res: Response) {
        try {
            const result = await WhatsAppService.stopSession(req.user)
            return responseSuccess(
                res,
                'WhatsApp session stopped successfully',
                result
            )
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async qrcode(req: Request, res: Response) {
        try {
            const result = await WhatsAppService.qrcode(req.user)
            return responseSuccess(
                res,
                'WhatsApp QR code retrieved successfully',
                result
            )
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async whatsappToken(req: Request, res: Response) {
        try {
            const result = await WhatsAppService.whatsappToken(req.user)
            return responseSuccess(
                res,
                'WhatsApp token retrieved successfully',
                result
            )
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async sendMessage(req: Request, res: Response) {
        try {
            const whatsappApiKey = req.header('whatsapp_api_key')

            const { number, text } = req.body
            await WhatsAppService.sendMessage(whatsappApiKey, number, text)

            return responseSuccess(res, 'Message sent successfully')
        } catch (err) {
            return responseError(res, err)
        }
    }
}
