const express=require('express');
const router=express.Router();
const loginHandler=require("../../controller/UserHandler/loginHandler");
const loginValidation=require("../../middleware/loginValidation");
router.post("/login",loginValidation,loginHandler);
module.exports=router;