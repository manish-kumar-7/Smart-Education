const express=require("express");
const router=express.Router();
const account=require("../../controller/UserHandler/accountHandler");
const isLoggedIn=require("../../middleware/isLoggedIn");
router.get("/profile/user",isLoggedIn,account)
module.exports=router;