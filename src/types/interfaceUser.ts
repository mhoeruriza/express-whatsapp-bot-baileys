interface AuthUser {
    id: string
    fullname: string
    email: string
    role: string
}

interface UpdatePasswordPayload {
    current_password: string
    new_password: string
    confirm_password: string
}

interface UpdateProfilePayload {
    fullname: string
}

type Upload = {
    file: Express.Multer.File
}

export { AuthUser, UpdatePasswordPayload, UpdateProfilePayload, Upload }
