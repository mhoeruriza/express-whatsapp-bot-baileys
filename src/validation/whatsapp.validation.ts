import Joi from 'joi'

export const sendMessageSchema = Joi.object({
    number: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(15)
        .required()
        .messages({
            'string.base': 'Nomor harus berupa string',
            'string.empty': 'Nomor tidak boleh kosong',
            'string.pattern.base': 'Nomor hanya boleh berisi angka',
            'string.min': 'Nomor minimal 10 digit',
            'string.max': 'Nomor maksimal 15 digit',
            'any.required': 'Nomor wajib diisi',
        }),
    text: Joi.string().trim().min(1).required().messages({
        'string.base': 'Pesan harus berupa string',
        'string.empty': 'Pesan tidak boleh kosong',
        'string.min': 'Pesan tidak boleh kosong',
        'any.required': 'Pesan wajib diisi',
    }),
})
