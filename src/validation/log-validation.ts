import Joi from 'joi'

// validasi show
export const showLogSchema = Joi.object({
    id: Joi.number().required(),
})
