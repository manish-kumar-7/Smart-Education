const express=require("express");
const router=express.Router();
const deleteAdmin=require("../../controller/ownerHandler/deleteAdmin");
router.delete("/deleteAdmin",deleteAdmin);
module.exports=router;