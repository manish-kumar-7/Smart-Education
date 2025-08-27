const express=require("express");
const router=express.Router();
const adminaccount=require("../../controller/AdmineHandler/AdminAccount");
const isLogin=require("../../middleware/isLoggedIn");
router.get("/adminDashboard/account",isLogin,adminaccount);

module.exports=router;