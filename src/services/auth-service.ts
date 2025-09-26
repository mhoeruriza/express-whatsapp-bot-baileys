import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user-model.js'
import sequelize from '../config/database.js'
import { ValidateError } from '../utils/errors.js'
import Roles from '../models/roles-model.js'

export class AuthService {
    // Registrasi Pengguna
    static async register(payload: User) {
        const t = await sequelize.transaction()
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(payload.password, 10)

            // check Email
            const checkEmail = await User.findOne({
                where: { email: payload.email },
            })
            if (checkEmail) {
                throw new ValidateError('Email already exists')
            }

            // Simpan pengguna baru ke database
            const user = await User.create(
                {
                    fullname: payload.fullname,
                    email: payload.email,
                    password: hashedPassword,
                    id_role: payload.id_role,
                },
                { transaction: t }
            )

            const role = await Roles.findByPk(payload.id_role)

            // Generate token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname,
                    role: role?.slug,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: '1h',
                }
            )

            t.commit()

            return {
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: role?.slug,
                },
                token,
            }
        } catch (error) {
            t.rollback()
            throw error
        }
    }

    // Login Pengguna
    static async login(email: string, password: string) {
        // Cari pengguna berdasarkan email
        const user = await User.findOne({
            include: [
                {
                    association: 'role',
                },
            ],
            where: { email },
        })
        if (!user) {
            throw new ValidateError('User not found')
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new ValidateError('Invalid credentials')
        }

        const role = user.role?.slug
        const token = jwt.sign(
            {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: role,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        )

        return {
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: role,
            },
            token,
        }
    }

    // Verifikasi Token JWT
    static verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!)
            return decoded
        } catch (error) {
            throw new Error('Invalid or expired token')
        }
    }
}
