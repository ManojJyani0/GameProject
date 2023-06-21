import Joi from "joi";


export const gameSchema = Joi.object({
    contestId :Joi.string().required(),
    number:Joi.number().max(9).required(),
    betAmount:Joi.number().required().min(10),
})