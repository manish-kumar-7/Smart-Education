const Joi=require("joi");
module.exports=(req,res,next)=>{
  const schema=Joi.object({
    title:Joi.string().required(),
    content:Joi.string().required()
  })
  const {error}=schema.validate(req.body);
  if(error){
    return res.status(400).json({message:"Bad Request",error})
  }
  next();
}