import mongoose from "mongoose";
import { Schema } from "mongoose";


const PromoCodeSchema = new Schema({
  PromoCode:{
    type: String,
  },
  PromoGenrator:{
    type:String
  }
})

export default mongoose.model("PromoCode", PromoCodeSchema, "promocodes");
