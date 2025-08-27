const express = require("express");

const usermodel = require("../../models/UserModel/user");

const writenoteValidation = require("../../middleware/writenoteValidation");
const writenotemodel = require("../../models/UserModel/writenote");
const router = express.Router();
router.post("/profile/id", writenoteValidation, async (req, res) => {
 
  try {
    let { title, content } = req.body;
    const currentUserId=req.user.userid;
    //console.log(currentUserId);
    let existtitle = await writenotemodel.findOne({ title });

    if (existtitle) {
      return res
        .status(404)
        .json({ message: "file name is already exist", success: false });
    }
    else{
      const writenote = await writenotemodel.create({
      title,
      content,
      userid: currentUserId,
    });
    await usermodel.findByIdAndUpdate(currentUserId,{ $push: { notes: writenote._id } },
  { new: true });
  
    res
      .status(201)
      .json({ message: "your note is Successfully Saved", success: true });
    }
    
  } catch (error) {
    res.status(401).json({ message: "You Have Not LoggedIn", success: false });
  }
});
//file fetching
router.get("/profile/file",async (req,res)=>{
  const userid=req.user.userid;
  //console.log(userid);
const file=await writenotemodel.find({userid});
res.status(200).json({file,success:true});
});

router.delete("/profile/file/:id", async (req, res) => {
  try {
    const id = req.params.id; 
    const deletedUser = await writenotemodel.findOneAndDelete({ _id: id }); 

    if (!deletedUser) {
      return res.status(404).json({ message: "File not exist in DataBase", success: false });
    }

    res.status(200).json({ message: "File deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server side problem", success: false, error: error.message });
  }
});

module.exports = router;
