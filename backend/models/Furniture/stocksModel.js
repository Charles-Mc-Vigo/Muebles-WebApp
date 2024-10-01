const mongoose = require("mongoose");

const stocksSchema = new mongoose.Schema({
  stocks:{
    type:Number,
    required:true
  }
},{
  timestamps:true
})

const Stocks = mongoose.model("Stocks",stocksSchema);
module.exports = Stocks;