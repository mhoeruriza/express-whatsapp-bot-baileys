import { Router } from 'express'
import { WAController } from '../controllers/whatsapp.controller.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { sendMessageSchema } from '../validation/whatsapp.validation.js'
import { whatsappMiddleware } from '../middleware/whatsapp.middleware.js'

const router = Router()

router.post('/start', WAController.startSession)
router.post('/stop', WAController.stopSession)
router.get('/qrcode', WAController.qrcode)
router.get('/token', WAController.whatsappToken)
router.post(
    '/send',
    whatsappMiddleware,
    validateRequest(sendMessageSchema),
    WAController.sendMessage
)
export default router
