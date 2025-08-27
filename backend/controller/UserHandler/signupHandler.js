const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const usermodel=require("../../models/UserModel/user");
module.exports=async (req,res)=>{
  try{
    let{username,email,password,}=req.body;
  const exist=await usermodel.findOne({email})

  if(exist) return res.status(409).json({message:"User is already exist, you can login", success:false});
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async (err,result)=>{
      const user= await usermodel.create({
        username,
        password:result,
        email,
      })
      // const token=jwt.sign({email,userid:user._id},process.env.SECRET_KEY,{expiresIn:'24h'});
      // res.cookie("token",token);
      res.status(201).json({message:"Signup Successfully",success:true});
    })
    
  })
  }
  catch(error){
    res.status(500).json({message:" internal server problem",success:false});
  }
  
}

