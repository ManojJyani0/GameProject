import mongoose from "mongoose";
import { MONGO_DB_URL } from "../../config/index.mjs";
//database connecation
export const dbConnecation = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(MONGO_DB_URL);
    mongoose.connection.on("connection",()=>{
      console.log("DB connected")
    })
  } catch (error) {
    console.log(error);
  }
};
