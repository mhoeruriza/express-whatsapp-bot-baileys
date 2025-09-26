import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Roles from './roles-model.js'

class User extends Model {
    id!: number
    fullname!: string
    email!: string
    password!: string
    id_role!: number
    role!: Roles
    profile_photo!: string
    whatsapp_status!: string
    whatsapp_qrcode!: string
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        profile_photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        whatsapp_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        whatsapp_qrcode: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
)

export default User
