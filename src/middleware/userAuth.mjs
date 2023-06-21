import { CustomErrorHandler, JwtService } from "../services/index.mjs";


const userAuth =(req, res, next)=>{
    const token = req.header("Authorization");
    if(!token){
        return next(CustomErrorHandler.unAuthorized());
    }
    try {
        const decode = JwtService.verify(token.toString().split("Bearer ")[1]);
        if(decode)  {
            // console.log(decode)
            req.user= decode;
            next()
        }
        
    } catch (error) {
        console.log(error)
        return next(error)
    }

}


export default userAuth;