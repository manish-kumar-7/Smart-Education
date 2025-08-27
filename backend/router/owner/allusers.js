const express=require("express");
const router=express.Router();
const alluser=require("../../controller/ownerHandler/fetchAllUser");
router.get("/alluser",alluser);
module.exports=router;