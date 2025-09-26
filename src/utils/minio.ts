import { Client } from 'minio'
import { minio } from '../config/config.js'

class Minio {
    private client
    constructor() {
        this.client = new Client({
            endPoint: minio.endpoint,
            useSSL: minio.use_ssl,
            accessKey: minio.access_key,
            secretKey: minio.secret_key,
        })
    }

    public async Upload(
        path: string,
        source: Buffer,
        size: number,
        mimetype: string
    ) {
        try {
            await this.client.putObject(minio.bucket, path, source, size, {
                'Content-Type': mimetype,
            })
            return `${minio.endpoint}/${minio.bucket}/${path}`
        } catch (error) {
            throw error
        }
    }

    public async Delete(path: string) {
        try {
            await this.client.removeObject(minio.bucket, path)
            return true
        } catch (error) {
            throw error
        }
    }
}

export default Minio
