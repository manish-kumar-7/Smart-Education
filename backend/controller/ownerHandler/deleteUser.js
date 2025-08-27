const express = require("express");
const router = express.Router();
const userModel = require("../../models/UserModel/user");
const isOwnerLogin = require("../../middleware/isloginOwner");
const notemodel=require("../../models/UserModel/writenote");

router.delete("/deleteUser", isOwnerLogin, async (req, res) => {
  try {
    const  {userId} = req.body; 
    
    const deletedUser = await userModel.findByIdAndDelete(userId);
    const deletedNotes = await notemodel.deleteMany({ userid: userId });

    //console.log(deleteNote);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    return res.status(200).json({ message: "User deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
});

module.exports = router;
