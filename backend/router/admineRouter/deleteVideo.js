const express=require("express");
const router=express.Router();
const deleteVideo=require("../../controller/AdmineHandler/deleteVideo");
router.delete("/deleteVideo",deleteVideo);
module.exports=router;