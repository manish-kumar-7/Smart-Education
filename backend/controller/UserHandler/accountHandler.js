const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const usermodel = require("../../models/UserModel/user");

const writenotemodel=require("../../models/UserModel/writenote");
router.get("/profile/user", isLoggedIn, async (req, res) => {
 
  try {
    const id = req.user.userid;
    
    const user = await usermodel.findOne({ _id: id });
    //console.log(user);
    const note=await writenotemodel.find({userid:user._id});

    const titles = note.map(item => item.title);
    res.status(201).json({user,titles,success:true});
    
  } catch (error) {
    res.status(400).json({message:"Server Problem"});
  }
});
module.exports = router;
