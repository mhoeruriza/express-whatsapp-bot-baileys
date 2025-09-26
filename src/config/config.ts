import { Dialect } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

interface DatabaseConfig {
    username: string
    password: string
    database: string
    host: string
    dialect: Dialect
    port?: number
}

export const app = {
    env: process.env.APP_ENV || 'development',
}

const development: DatabaseConfig = {
    username: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
}

const production: DatabaseConfig = {
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
    host: process.env.DB_HOST || '',
    dialect: (process.env.DB_DIALECT as Dialect) || 'postgres',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
}

export const minio = {
    endpoint: process.env.MINIO_ENDPOINT || '',
    access_key: process.env.MINIO_ACCESS_KEY || '',
    secret_key: process.env.MINIO_SECRET_KEY || '',
    bucket: process.env.MINIO_BUCKET || '',
    use_ssl: process.env.MINIO_USE_SSL === 'true',
}

export const whatsappToken = {
    whatsapp_api_key: process.env.WHATSAPP_API_KEY || '',
}

export default { development, production }
