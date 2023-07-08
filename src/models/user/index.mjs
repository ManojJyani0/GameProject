import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
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
      enum: ["Admin", "Player", "Administrator"],
      default: "Player",
    },
    accountVarification: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 0.0,
    },
    winningCoins: {
      type: Number,
      default: 0,
    },
    promo_code: {
      type: String,
    },
    AccountNumbers: [
      {
        accountHolderName: {
          type: String,
        },
        accountNumber: {
          type: Number,
          unique:true
        },
        bankName: {
          type: String,
        },
        IFSC_code: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema, "users");
