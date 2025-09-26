interface ICustomError {
    status_code: number
}

export class CustomError extends Error {
    public readonly customError: ICustomError

    constructor(message: string, payload: ICustomError) {
        super(message)
        this.customError = payload
    }
}

export class ValidateError extends Error {
    constructor(message: string) {
        super(message)
    }
}
