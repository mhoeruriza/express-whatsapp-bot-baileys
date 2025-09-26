import { initWhatsApp } from '../utils/whatsapp.js'

const userId = process.argv[2]
if (!userId) {
    console.error('❌ userId wajib dikirim ke worker')
    process.exit(1)
}

async function start() {
    await initWhatsApp(userId, (event) => {
        if (process.send) {
            process.send({ userId, ...event })
        }
    })
    console.log(`🚀 Worker WhatsApp untuk user ${userId} jalan`)
}

start()
