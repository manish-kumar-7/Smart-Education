const express=require("express");
const router=express.Router();
const RequestAdmin=require("../../controller/AdmineHandler/RequestAdmin");
const Requestvalidation=require("../../middleware/RequersAdmin")
router.post("/adminAccess",Requestvalidation,RequestAdmin);
module.exports=router;