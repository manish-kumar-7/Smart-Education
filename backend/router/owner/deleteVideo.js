const express=require("express");
const router=express.Router();
const deleteVideo=require("../../controller/ownerHandler/deleteVideo");
const Islogin = require("../../middleware/isloginOwner");
router.delete("/deleteVid",deleteVideo);
module.exports=router;