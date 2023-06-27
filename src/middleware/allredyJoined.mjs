import { Contest } from "../models/index.mjs";
import { CustomErrorHandler, JwtService } from "../services/index.mjs";
import { gameSchema } from "../validator/game.mjs";

const allReadyJoind = async (req, res, next)=>{
    const {error, value } = gameSchema.validate(req.body)
    if(error){
        return next(error);
    }
    try {
        const doc = await Contest.find({contestId:value.contestId,userId:req.user._id})
        next()
    } catch (error) {
        console.log(error)
        return next(error)
    }

}


export default allReadyJoind;