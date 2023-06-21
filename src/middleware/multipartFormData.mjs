import path from 'path'
import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,callback)=>callback(null,"uploads/"),
    filename:(req, file,callback)=>{
        const uniqueName = `QR_Code${path.extname(file.originalname)}`
        callback(null,uniqueName)
    }
})

const handleMultipartData = multer({storage,limits:{fileSize:1000000*5}}).single("image")

export default handleMultipartData;