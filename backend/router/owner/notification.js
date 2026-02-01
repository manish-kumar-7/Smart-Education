const express=require("express");
const router=express.Router();
const notification=require("../../controller/ownerHandler/noticication");
router.get("/notification",notification);
module.exports=router;