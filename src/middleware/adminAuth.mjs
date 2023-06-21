import { User } from "../models/index.mjs";
import {CustomErrorHandler} from "../services/index.mjs";


const adminAuth = async (req, res, next)=>{
    try {
        // console.log(req.user)
        if(req.user.roleType==="Admin"){
           return next();
        }
        return next(CustomErrorHandler.unAuthorized())
    } catch (error) {
        return next(error)
    }
}


export default adminAuth;