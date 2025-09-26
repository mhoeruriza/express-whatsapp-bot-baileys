import Joi from 'joi'

// Skema validasi untuk registrasi
export const registerSchema = Joi.object({
    fullname: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    id_role: Joi.number().required(),
})

// Skema validasi untuk login
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})
