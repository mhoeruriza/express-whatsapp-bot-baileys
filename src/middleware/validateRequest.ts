import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export function validateRequest(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        })

        if (error) {
            res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors: error.details[0].message, // cuma ambil pesan pertama
            })
            return
        }

        req.body = value
        next()
    }
}
