const jwt=require("jsonwebtoken");

module.exports= (req,res,next)=>{
  if (!req.cookies.token) {
    return res.status(403).json({ message: "Unauthorized, JWT token is required" });
  }
  try{
  const data=jwt.verify(req.cookies.token,process.env.SECRET_KEY);
  req.user=data;
  next();
  }
  catch(error){
    return res.status(403).json({message:"Unauthorized please login"})
  }
}