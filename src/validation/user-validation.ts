import Joi from 'joi'

export const updatePasswordSchema = Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required(),
})

export const updateProfileSchema = Joi.object({
    fullname: Joi.string().required(),
})
