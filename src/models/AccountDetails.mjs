import mongoose from "mongoose";
import { Schema } from "mongoose";
import { BASE_URL } from "../../config/index.mjs";

const AccountSchema = new Schema({
  upiID: {
    type: String,
  },
  AccountHolder: {
    type: String,
  },
  imageUrl:{
    type:String,
    required:true,
    get:(image)=>{
      return `${BASE_URL}/${image}`
    }
  }
},{toJSON:{getters:true},id:false})

export default mongoose.model("Account", AccountSchema, "accounts");
