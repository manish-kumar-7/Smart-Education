const express = require("express");
const router = express.Router();
const adminmodel = require("../../models/AdminModel/admin");

router.put("/Adminprofile/update", async (req, res) => {
  try {
    const userEmail = req.user?.email;
    //console.log(userEmail)
    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized: No user email", success: false });
    }

    const { username, email } = req.body;

   
    if (!username && !email) {
      return res.status(400).json({ message: "No update fields provided", success: false });
    }

    
    const finduser=await adminmodel.findOne({email:userEmail});
    //console.log(finduser);
    const updatedUser = await adminmodel.findOneAndUpdate(
      {email:userEmail },
      {email:email,username:username},
      { new: true }
    );
    res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user: updatedUser
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error", success: false });
  }
});

module.exports = router;
