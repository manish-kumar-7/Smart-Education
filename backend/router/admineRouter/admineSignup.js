const express=require("express");
const router=express.Router();
const signupHandler=require("../../controller/AdmineHandler/AdminSignup");
const signUpValidation=require("../../middleware/signUpValidation")
const Islogin=require("../../middleware/isloginOwner")
router.post("/admin/signup",Islogin,signUpValidation,signupHandler);

module.exports=router;