import { Response } from 'express'
import { CustomError, ValidateError } from './errors.js'

export const responseErrorServer = (res: Response, errors: unknown) => {
    const app = process.env.APP_ENV || 'LOCAL'

    res.status(500).json({
        status: false,
        message: app != 'PRODUCTION' ? errors : 'Server Error',
    })
}

export const responseErrorValidate = (
    res: Response,
    errorMessages?: string[] | string
) => {
    res.status(400).json({
        status: false,
        message: errorMessages,
    })
}

export const responseErrorCustom = (
    res: Response,
    errorStatus: number,
    errorMessages: any,
    data?: object
) => {
    res.status(errorStatus).json({
        success: false,
        message: errorMessages,
        data: data,
    })
}

export const responseError = (res: Response, error: unknown) => {
    if (error instanceof EvalError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof RangeError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof ReferenceError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof SyntaxError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof TypeError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof URIError) {
        responseErrorServer(res, error.message)
    } else if (error instanceof ValidateError) {
        responseErrorValidate(res, error.message)
    } else if (error instanceof CustomError) {
        responseErrorCustom(res, error.customError.status_code, error.message)
    } else if (error instanceof Error) {
        responseErrorServer(res, error)
    }
}

export const responseSuccess = (
    res: Response,
    messages?: string,
    data?: object
) => {
    res.status(200).json({
        success: true,
        messages: messages,
        data: data,
    })
}
