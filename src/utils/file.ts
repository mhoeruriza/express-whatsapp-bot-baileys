import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { PROFILE_PHOTO_PATH } from '../types/file.constants.js'
import { minio } from '../config/config.js'

export const CustomNameFile = (file: Express.Multer.File) => {
    const ext = extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    return `${filename}`
}

export const CustomPathFile = (path: string, filename: string) => {
    return `${path}/${filename}`
}

export const ProfilePhotoPathFile = (filename: string) => {
    return `${minio.endpoint}/${minio.bucket}/${PROFILE_PHOTO_PATH}/${filename}`
}
