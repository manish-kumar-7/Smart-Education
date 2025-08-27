const express=require("express");
const router=express.Router();
const fetchVideo=require("../../controller/AdmineHandler/fetchVideo");
router.get("/profileVideo",fetchVideo);
module.exports=router;