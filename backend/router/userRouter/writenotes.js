const express=require("express");
const notesHandle=require("../../controller/UserHandler/notesHandle");
const isLoggedin=require("../../middleware/isLoggedIn")

const router=express.Router();
router.post("/profile/id",isLoggedin,notesHandle);
router.get("/profile/file",isLoggedin,notesHandle);
router.delete("/profile/file/:id",isLoggedin,notesHandle);
module.exports=router;