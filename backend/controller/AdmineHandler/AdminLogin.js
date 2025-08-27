
const adminmodel=require("../../models/AdminModel/admin");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
module.exports= async (req,res)=>{
  let{email,password}=req.body;
  let admin= await adminmodel.findOneAndUpdate(
  { email },
  { $set: { role: "admin" } },
  { new: true } );
  if(admin){
    bcrypt.compare(password,admin.password,(error,result)=>{
      if(error) return res.status(500).send("server side error");
      if(result){
        const token=jwt.sign({email,adminid:admin._id},process.env.SECRET_KEY,{expiresIn:'24h'});
        res.cookie("token",token);
        res.status(200).json({
          message:"you are logged in", success:true,
          email,
          username:admin.username,
          role:admin.role,
          //token
        });
      }
      else{
        res.status(409).json({message:"Enter valid  email password ",success:false});
      }
    })
  }
  else{
    res.status(403).json({message:"admin not exist please signup",success:false});
  }
}