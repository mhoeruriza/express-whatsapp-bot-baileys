import { ValidateError } from './errors.js'

export const validateImageFile = (
    file: Express.Multer.File,
    maxSizeInMB = 2
) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new ValidateError(
            'Invalid file type. Only JPG, PNG, and WEBP are allowed.'
        )
    }

    const maxSize = maxSizeInMB * 1024 * 1024
    if (file.size > maxSize) {
        throw new ValidateError(`File size exceeds the ${maxSizeInMB}MB limit.`)
    }
}
