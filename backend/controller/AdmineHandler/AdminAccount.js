const express = require("express");
const router = express.Router();
const adminmodel = require("../../models/AdminModel/admin");
const videomodel=require("../../models/AdminModel/adminVideoes");
router.get("/adminDashboard/account",async (req, res) => {
 
  try {
    //console.log(req.user);
    const id = req.user.adminid;
    //console.log(id);
     const admin = await adminmodel.findOne({ _id: id });
    // console.log(admin);
     //console.log(admin._id);
    const createdVideo=await videomodel.find({uploadedBy:admin._id});
    //console.log(title);
    const titles = createdVideo.map((video) => video.title);
    res.status(201).json({admin,titles,success:true});
    
  } catch (error) {
    res.status(400).json({message:"Server Problem"});
  }
});
module.exports = router;
