import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth-routes.js'
import userRoutes from './routes/user-routes.js'
import whatsappRoutes from './routes/whatsapp.routes.js'
import { authMiddleware } from './middleware/auth-middleware.js'
import cors from 'cors'
import { setupAssociations } from './models/association.js'
import { connect } from './config/database.js'

dotenv.config()

const app = express()
const port = process.env.APP_PORT || 5000
const prefix = process.env.APP_PREFIX || ''

const conn = async () => {
    await connect()

    await setupAssociations()
}

conn()

app.use(express.json()) // Middleware untuk parse JSON body

const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions))

// Menggunakan routing autentikasi
app.use(`/api/auth`, authRoutes)
app.use(`/users`, authMiddleware, userRoutes)
app.use('/api/whatsapp', authMiddleware, whatsappRoutes)

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`)
})
