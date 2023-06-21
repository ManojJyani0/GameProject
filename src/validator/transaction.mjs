import Joi from "joi";

export const depositSchema = Joi.object({
    amount: Joi.number().min(100).required(),
    UTR:Joi.number().required()
})

export const withdrawalSchema = Joi.object({
    accountHolderName:Joi.string().required(),
    accountNumber:Joi.number().required(),
    confirmAccountNumber:Joi.number().equal(Joi.ref('accountNumber')).required(),
    bankName:Joi.string().required(),
    amount: Joi.number().min(100).required(),
    IFSC_code:Joi.string().required(),
    agreement:Joi.boolean(),
})

export const utrValidation = Joi.object({
    utr: Joi.number().required(),
    
})

