const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Videomodel = require("../../models/AdminModel/adminVideoes");
const adminmodel=require("../../models/AdminModel/admin");
const Islogin = require("../../middleware/isloginOwner");
router.delete("/deleteVid", Islogin, async (req, res) => {
  const { videoId } = req.body;
  //console.log(videoId);
  if (!videoId) {
    return res
      .status(400)
      .json({ success: false, message: "Video ID is required" });
  }

  try {
    const videoDoc = await Videomodel.findById(videoId);

    if (!videoDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found in DB" });
    }

    const videoPath = path.join(__dirname, "../../public", videoDoc.videoUrl);
    const thumbnailPath = path.join(
      __dirname,
      "../../public",
      videoDoc.thumbnailUrl
    );

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
    }

   const deletedVideo= await Videomodel.findByIdAndDelete(videoId,{new:true});
    const adminId = deletedVideo.uploadedBy;
const updatedAdmin = await adminmodel.findByIdAndUpdate(
  adminId,
  { $pull: { videoes: deletedVideo._id } },
  { new: true }
);
    res.json({
      success: true,
      message: "Video and files deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting video" });
  }
});
module.exports = router;



