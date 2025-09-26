import { Request, Response } from 'express'
import {
    responseError,
    responseErrorValidate,
    responseSuccess,
} from '../utils/response.js'
import {
    updatePasswordSchema,
    updateProfileSchema,
} from '../validation/user-validation.js'
import { UserService } from '../services/user-service.js'
import { validateImageFile } from '../utils/fileValidator.js'

export class UserController {
    static async updatePassword(req: Request, res: Response) {
        try {
            const { error, value } = updatePasswordSchema.validate(req.body, {
                abortEarly: false,
            })

            if (error) {
                const errorMessages = error.details.map(
                    (detail) => detail.message
                )
                return responseErrorValidate(res, errorMessages[0])
            }

            await UserService.updatePassword(value, req.user)
            return responseSuccess(res)
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const { error, value } = updateProfileSchema.validate(req.body, {
                abortEarly: false,
            })

            if (error) {
                const errorMessages = error.details.map(
                    (detail) => detail.message
                )
                return responseErrorValidate(res, errorMessages[0])
            }

            await UserService.updateProfile(value, req.user)
            return responseSuccess(res)
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async updateProfilePicture(req: Request, res: Response) {
        try {
            if (!req.file) {
                return responseErrorValidate(
                    res,
                    'Profile picture file is required'
                )
            }

            validateImageFile(req.file)

            const result = await UserService.updateProfilePicture(
                { file: req.file },
                req.user
            )

            return responseSuccess(
                res,
                'Success update profile picture',
                result
            )
        } catch (error) {
            return responseError(res, error)
        }
    }

    static async profile(req: Request, res: Response) {
        try {
            const result = await UserService.profile(req.user)
            return responseSuccess(res, 'Success get profile', result)
        } catch (error) {
            return responseError(res, error)
        }
    }
}
