import { Model, DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

class Roles extends Model {
    id!: number
    name!: string
    slug!: string
    created_at!: Date
    updated_at!: Date
}

Roles.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        slug: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
)

export default Roles
