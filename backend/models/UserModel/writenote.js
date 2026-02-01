const mongoose=require('mongoose');

const writenote=mongoose.Schema({
title:{
  type:String,
  required :true,
  unique:true
},
content:{
  type:String,
},
userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
})

module.exports=mongoose.model("Note",writenote)