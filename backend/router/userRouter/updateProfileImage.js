const express=require("express");
const router=express.Router();
const isLogin=require("../../middleware/isLoggedIn");
const updateProfileHandler=require("../../controller/UserHandler/profileUpdateHandler");
router.put("/profile/update",isLogin,updateProfileHandler);

module.exports=router;