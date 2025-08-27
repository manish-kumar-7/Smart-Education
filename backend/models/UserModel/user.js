const mongoose=require("mongoose");
const user=mongoose.Schema({
  username:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'writenote'
  }],
  profilepic:{
    type:String,
  },
   role:{
    type:String,
   
    unique: true
  },
})
module.exports=mongoose.model("User",user);