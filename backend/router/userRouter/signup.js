const express=require("express");
const router=express.Router();
const signupHandler=require("../../controller/UserHandler/signupHandler");
const signUpValidation=require("../../middleware/signUpValidation")
router.post("/signup",signUpValidation,signupHandler);

module.exports=router;