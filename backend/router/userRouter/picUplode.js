const express=require("express");
const router=express.Router();
const picHandler=require("../../controller/UserHandler/picHandler")
router.post("/profile/picUplode",picHandler);
module.exports=router;