const express=require("express");
const router=express.Router();
const updateNoti=require("../../controller/ownerHandler/updatenotification");
router.patch("/status",updateNoti);
module.exports=router;