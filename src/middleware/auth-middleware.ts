import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../services/auth-service.js'
import { AuthUser } from '../types/interfaceUser.js'
import { responseErrorCustom } from '../utils/response.js'

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const header = req.header('Authorization')
    const token: string = header ? header.replace('Bearer ', '') : ''

    if (!token) {
        responseErrorCustom(res, 401, 'Access Denied. No token provided.')
        return
    }

    try {
        const decoded = AuthService.verifyToken(token) as AuthUser
        req.user = decoded // Menyimpan user di request untuk digunakan di controller
        next()
    } catch (error) {
        responseErrorCustom(res, 401, 'Invalid or expired token.')
        return
    }
}
