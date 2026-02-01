const express=require("express");
const router=express.Router();
const editVideo=require("../../controller/AdmineHandler/editVideo");
router.put("/editVideo",editVideo);
module.exports=router;