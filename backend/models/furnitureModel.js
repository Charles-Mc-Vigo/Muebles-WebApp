const mongoose = require("mongoose");

const furnitureSchema = mongoose.Schema({
  category:{
    type:String,
    enum:["Door","Bed frame","Cabinet","Chair", "Table","Sala set"],
    required:true
  },
  furnitureType:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true,
    default:0
  },
  currency:{
    type:String,
    enum:["PHP"],
    default:"PHP"
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
})



const Furniture = mongoose.model("Furniture",furnitureSchema);
module.exports = Furniture;