const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  ownername: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    required: true,
    unique: true
  },
  singleton: { 
    type: String,
    default: "ONLY_ONE_OWNER",
    unique: true
  },
  
});

module.exports = mongoose.model("Owner", ownerSchema);
