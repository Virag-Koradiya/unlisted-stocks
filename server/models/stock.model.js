import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  logo: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export const Stock = mongoose.model('Stock', stockSchema);
