import { Router } from 'express'
import { AuthController } from '../controllers/auth-controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const router: Router = Router()

// Rute registrasi dan login tanpa proteksi
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

// Rute yang dilindungi dengan middleware auth
router.get('/profile', authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'This is protected data',
        user: 'req.user',
    })
})

export default router
