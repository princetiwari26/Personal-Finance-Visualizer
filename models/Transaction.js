import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userToken: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);