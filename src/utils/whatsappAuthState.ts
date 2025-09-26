import {
    AuthenticationState,
    SignalDataTypeMap,
    SignalKeyStore,
    BufferJSON,
    initAuthCreds,
} from '@whiskeysockets/baileys'
import WaSession from '../models/wa-sessions-model.js'
import { v4 as uuidv4 } from 'uuid'

export async function useDbAuthState(
    userId: string
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> {
    let record = await WaSession.findOne({ where: { user_id: userId } })

    let session = record
        ? JSON.parse(record.session_data, BufferJSON.reviver)
        : { creds: initAuthCreds(), keys: {} }

    const saveSession = async () => {
        const data = JSON.stringify(session, BufferJSON.replacer)
        if (record) {
            record.session_data = data
            await record.save()
        } else {
            record = await WaSession.create({
                user_id: userId,
                session_data: data,
                whatsapp_keys: uuidv4(),
            })
        }
    }

    const state: AuthenticationState = {
        creds: session.creds,
        keys: {
            get: async (type, ids) => {
                const data = session.keys[type] || {}
                const result: { [id: string]: any } = {}
                for (const id of ids) {
                    if (data[id]) {
                        result[id] = data[id]
                    }
                }
                return result
            },
            set: async (data) => {
                for (const type in data) {
                    session.keys[type as keyof SignalDataTypeMap] = {
                        ...(session.keys[type as keyof SignalDataTypeMap] ||
                            {}),
                        ...data[type as keyof SignalDataTypeMap],
                    }
                }
                await saveSession()
            },
        } as SignalKeyStore,
    }

    return {
        state,
        saveCreds: saveSession,
    }
}
