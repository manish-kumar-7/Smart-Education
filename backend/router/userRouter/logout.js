const express=require("express");
const router=express.Router();
const logoutHandler=require("../../controller/UserHandler/logoutHandler");
router.get("/logout",logoutHandler);
module.exports=router;