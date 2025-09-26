import { Request, Response, NextFunction } from 'express'
import { responseErrorCustom } from '../utils/response.js'
import { whatsappToken } from '../config/config.js'

export const whatsappMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const header = req.header('whatsapp_api_key')
    const token: string = header ?? ''

    if (!token) {
        return responseErrorCustom(res, 401, 'No token provided')
    }

    if (token !== whatsappToken.whatsapp_api_key) {
        return responseErrorCustom(res, 401, 'Token invalid')
    }

    try {
        next()
    } catch (error) {
        return responseErrorCustom(res, 401, 'Access Denied')
    }
}
