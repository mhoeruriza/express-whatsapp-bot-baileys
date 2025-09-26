import { Request, Response } from 'express'
import { AuthService } from '../services/auth-service.js'
import { loginSchema, registerSchema } from '../validation/auth-validation.js'
import {
    responseError,
    responseErrorValidate,
    responseSuccess,
} from '../utils/response.js'

export class AuthController {
    // Registrasi Pengguna
    static async register(req: Request, res: Response) {
        try {
            const { error, value } = registerSchema.validate(req.body, {
                abortEarly: false,
            })

            if (error) {
                const errorMessages = error.details.map(
                    (detail) => detail.message
                )
                return responseErrorValidate(res, errorMessages[0])
            }

            const result = await AuthService.register(value)
            return responseSuccess(res, 'Success register', result)
        } catch (error) {
            return responseError(res, error)
        }
    }

    // Login Pengguna
    static async login(req: Request, res: Response) {
        try {
            const { error, value } = loginSchema.validate(req.body, {
                abortEarly: false,
            })

            if (error) {
                const errorMessages = error.details.map(
                    (detail) => detail.message
                )
                return responseErrorValidate(res, errorMessages[0])
            }

            const { email, password } = value
            const result = await AuthService.login(email, password)

            return responseSuccess(res, 'Success login', result)
        } catch (error) {
            return responseError(res, error)
        }
    }
}
