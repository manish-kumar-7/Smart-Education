const express=require("express");
const router=express.Router();

const uplodevideo=require("../../controller/AdmineHandler/adminVideoUplode");

router.post("/uploadVideo",uplodevideo);
module.exports=router;