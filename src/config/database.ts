import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import config from './config.js'

dotenv.config()
const env = (process.env.NODE_ENV || 'development') as
    | 'development'
    | 'production'
const dbConfig = config[env]
const dbLog = process.env.DB_LOGGING === 'true' ? true : false

// Setup koneksi database
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: dbLog,
    }
)
// Mengecek koneksi
export const connect = async () => {
    await sequelize
        .authenticate()
        .then(() => {
            console.log('Connection to PostgreSQL established successfully.')
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error)
        })
}

export default sequelize
