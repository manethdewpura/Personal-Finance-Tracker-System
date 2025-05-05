import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalIncome: {
      type: Number,
      required: true,
    },
    totalExpense: {
      type: Number,
      required: true,
    },
    totalSavings: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
