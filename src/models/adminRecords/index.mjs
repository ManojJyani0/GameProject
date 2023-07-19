import mongoose from "mongoose";

const AdminTransactionSchema = new mongoose.Schema(
  {
    DateSting:{
        type:String
    },
    adminErnning:{
        type:Number,
    },
    totalAmount:{
        type:Number
    },
    totalNumberOfGames:{
        type:Number
    },
    totalDepositAmount:{
        type:Number
    },
    totalWithdrawalAmount:{
        type:Number
    },
    totalPromoAmount:{
        type:Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("AdminTransactionSchema", AdminTransactionSchema);