import bcrypt from 'bcryptjs'
import { ValidateError } from '../utils/errors.js'
import {
    AuthUser,
    UpdatePasswordPayload,
    UpdateProfilePayload,
    Upload,
} from '../types/interfaceUser.js'
import User from '../models/user-model.js'
import Minio from '../utils/minio.js'
import { PROFILE_PHOTO_PATH } from '../types/file.constants.js'
import { CustomNameFile, CustomPathFile } from '../utils/file.js'

export class UserService {
    static async updatePassword(
        payload: UpdatePasswordPayload,
        user: AuthUser
    ) {
        const data = await User.findByPk(user.id)

        if (!data) {
            throw new ValidateError('User not found')
        }

        const checkPassword = await bcrypt.compare(
            payload.current_password,
            data.password
        )

        if (!checkPassword) {
            throw new ValidateError(
                'New password cannot be the same as your old password'
            )
        }

        if (payload.confirm_password !== payload.new_password) {
            throw new ValidateError(
                'New password and confirmation do not match'
            )
        }

        const hashedPassword = await bcrypt.hash(payload.new_password, 10)

        await User.update(
            { password: hashedPassword },
            {
                where: { id: user.id },
            }
        )
    }

    static async updateProfile(payload: UpdateProfilePayload, user: AuthUser) {
        const existingUser = await User.findByPk(user.id)

        if (!existingUser) {
            throw new ValidateError('User not found')
        }

        await User.update(payload, {
            where: { id: user.id },
        })
    }

    static async updateProfilePicture(body: Upload, user: AuthUser) {
        const data = await User.findByPk(user.id)
        const filename = CustomNameFile(body.file)
        const path = CustomPathFile(PROFILE_PHOTO_PATH, filename)

        const minioClient = new Minio()

        if (data?.profile_photo) {
            const oldPath = CustomPathFile(
                PROFILE_PHOTO_PATH,
                data.profile_photo
            )
            try {
                await minioClient.Delete(oldPath)
            } catch (err) {
                throw new ValidateError('Failed to delete old profile photo')
            }
        }

        const photoUrl = await minioClient.Upload(
            path,
            body.file.buffer,
            body.file.size,
            body.file.mimetype
        )

        await User.update(
            { profile_photo: filename },
            {
                where: { id: user.id },
            }
        )

        return {
            photo_url: photoUrl,
        }
    }

    static async profile(user: AuthUser) {
        const data = await User.findByPk(user.id, {
            attributes: ['fullname', 'email', 'profile_photo'],
            include: [
                {
                    association: 'role',
                    attributes: ['slug'],
                },
            ],
        })

        if (!data) {
            throw new ValidateError('User not found')
        }

        return {
            fullname: data.fullname,
            email: data.email,
            role: data.role?.slug || null,
            //profile_photo: ProfilePhotoPathFile(data.profile_photo),
        }
    }
}
