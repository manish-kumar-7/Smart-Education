const express=require("express");
const router=express.Router();
const islogin=require("../../middleware/isLoggedIn");
const adminUpdate=require("../../controller/AdmineHandler/AdminProfileUpdate");

router.put("/Adminprofile/update",islogin,adminUpdate);
module.exports=router;