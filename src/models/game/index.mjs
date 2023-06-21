import mongoose, { Schema } from "mongoose";

const contestSchema = new Schema({
  contestId: {
    type: String,
  },
  winningNumber: Number,
  players: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      number: Number,
      betAmount: Number,
    },
  ],
  winners: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  gameEndTime: Date,
  status:{
    type:String,
    enum:["Open","Closed"],
    default:"Open"
  },
  winningPrice:{
    type:Number,
  },
  totalAmount:{
    type:Number,
  },
  adminErnning:{
    type:Number
  }
},{timestamps:true});
contestSchema.pre("save", function(next) {
  if (this.gameEndTime < new Date()) {
    this.status = "Closed";
  }
  next();
});
// Define the model for the game state
export default mongoose.model("Contest", contestSchema);
