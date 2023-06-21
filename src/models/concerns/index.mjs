import mongoose from "mongoose";

const concernSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    massage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolve"],
    },
    ContactNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Concern", concernSchema);
