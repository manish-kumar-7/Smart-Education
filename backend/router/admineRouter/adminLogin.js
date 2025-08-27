const express=require('express');
const router=express.Router();
const loginHandler=require("../../controller/AdmineHandler/AdminLogin");
const loginValidation=require("../../middleware/loginValidation");
router.post("/admin/login",loginValidation,loginHandler);
module.exports=router;