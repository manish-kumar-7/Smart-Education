const mongoose=require("mongoose");
require("dotenv").config();
const URL=process.env.URL;
//console.log(URL)
mongoose.connect(URL).then(()=>{
  console.log("mongodb connected");
}).catch((error)=>{
  console.log(error.message);
})