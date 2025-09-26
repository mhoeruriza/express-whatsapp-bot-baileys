import multer from 'multer'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const storagePath = process.env.TEMP_PATH

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${storagePath}/`)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.csv')
    },
})
const useUpload = multer({ storage: storage })

const useFilePath = (file: Express.Multer.File) => {
    return path.join(
        __dirname,
        '..',
        '..',
        `${storagePath}`,
        file.filename || ''
    )
}

export { useUpload, useFilePath }
