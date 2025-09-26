import { Router } from 'express'
import { UserController } from '../controllers/user-controller.js'
import { upload } from '../middleware/upload.js'

const router: Router = Router()

router.post('/update-password', UserController.updatePassword)
router.post('/update-profile', UserController.updateProfile)
router.post(
    '/upload-profile-picture',
    upload.single('file'),
    UserController.updateProfilePicture
)
router.get('/profile', UserController.profile)

export default router
