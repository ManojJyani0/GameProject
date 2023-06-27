import mongoose from "mongoose";   
import { Schema } from "mongoose";

const userSchema = new Schema({
        name: {
          type: String,
        },
        mobile: {
          type: Number,
          unique: true,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        roleType: {
          type: String,
          enum: ["Admin", "Player","Administrator"],
          default:"Player"
        },
        accountVarification: {
          type: Boolean,
          default: false,
        },
        amount: {
          type: Number,
          default: 0.0,
        },
        winningCoins:{
          type:Number,
          default:0
        }
        
      },
      {
        timestamps: true,
      }
    );


export default mongoose.model("User",userSchema,"users");