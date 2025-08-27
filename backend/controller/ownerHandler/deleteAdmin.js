const express = require("express");
const router = express.Router();
// const adminModel = require("../../models/AdminModel/admin");
 const isOwnerLogin = require("../../middleware/isloginOwner");


// router.delete("/deleteAdmin", isOwnerLogin, async (req, res) => {
//   try {
//     const  {adminId} = req.body; 
    
//     const deletedAdmin = await adminModel.findByIdAndDelete(adminId,{new:true});
    
//     if (!deletedAdmin) {
//       return res.status(404).json({ message: "Admin not found", success: false });
//     }

//     return res.status(200).json({ message: "Admin deleted successfully", success: true });
//   } catch (error) {
//     console.error("Error deleting admin:", error);
//     return res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// });

// module.exports = router;


const fs = require("fs");
const path = require("path");
const adminModel = require("../../models/AdminModel/admin");
const videoModel = require("../../models/AdminModel/adminVideoes");

router.delete("/deleteAdmin", isOwnerLogin,async(req, res)=>{
  const {adminId} = req.body;

  try {
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

   
    const videos = await videoModel.find({ uploadedBy: adminId });
    console.log(videos)
    
    for (const video of videos) {
      const videoPath = path.join(__dirname, "../../public", video.videoUrl);
      const thumbnailPath = path.join(__dirname, "../../public", video.thumbnailUrl);

      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

      await videoModel.findByIdAndDelete(video._id);

      await adminModel.findByIdAndUpdate(
        video.uploadedBy,
        { $pull: { videoes: video._id } },
        { new: true }
      );
    }
    await adminModel.findByIdAndDelete(adminId);

    res.status(200).json({
      success: true,
      message: "Admin and all associated videos deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
})

module.exports = router;
