import { Model, DataTypes, Optional } from 'sequelize'
import sequelize from '../config/database.js'
import type {
    AuthenticationCreds,
    SignalDataTypeMap,
} from '@whiskeysockets/baileys'

export interface SessionData {
    creds: AuthenticationCreds
    keys: {
        [T in keyof SignalDataTypeMap]?: { [id: string]: SignalDataTypeMap[T] }
    }
}

// untuk type Sequelize
interface WaSessionAttributes {
    id: number
    user_id: string
    session_data: string
    whatsapp_keys: string
    created_at?: Date
    updated_at?: Date
}

interface WaSessionCreationAttributes
    extends Optional<
        WaSessionAttributes,
        'id' | 'session_data' | 'whatsapp_keys'
    > {}

class WaSession
    extends Model<WaSessionAttributes, WaSessionCreationAttributes>
    implements WaSessionAttributes
{
    declare id: number
    declare user_id: string
    declare session_data: string
    declare whatsapp_keys: string
    declare readonly created_at: Date
    declare readonly updated_at: Date
}

WaSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        session_data: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: '{}',
        },
        whatsapp_keys: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'wa_sessions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
)

export default WaSession
