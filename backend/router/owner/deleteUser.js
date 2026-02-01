const express=require("express");
const router=express.Router();
const deleteUser=require("../../controller/ownerHandler/deleteUser");
router.delete("/deleteUser",deleteUser);
module.exports=router;