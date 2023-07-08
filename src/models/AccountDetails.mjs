import mongoose from "mongoose";
import { Schema } from "mongoose";
import { BASE_URL } from "../../config/index.mjs";

const AccountSchema = new Schema({
  payURL:{
    type: String,
  }
})

export default mongoose.model("Account", AccountSchema, "accounts");
