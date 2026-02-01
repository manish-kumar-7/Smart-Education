const express = require("express");
const router = express.Router();
const likeComment=require("../../controller/UserHandler/likeComment");
router.use("/",likeComment);
module.exports=router;