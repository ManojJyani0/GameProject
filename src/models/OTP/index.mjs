import mongoose from "mongoose";   
import { Schema } from "mongoose";

const otpSchema = new Schema({
    sid:{
        type:String,
        required:true
    },
    OTP:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        expires: 600, // This document will be deleted after 10 minits
        default: Date.now 
      }
    });


export default mongoose.model("OTP",otpSchema);