const express = require("express");
const router = express.Router();
const videomodel = require("../../models/AdminModel/adminVideoes"); 
const isLogin = require("../../middleware/isLoggedIn");

router.get("/fetchVideos", isLogin, async (req, res) => {
  try {
    const userId = req.user.adminid;
    //console.log(userId);
    const videos = await videomodel
      .find({ uploadedBy: userId })
      .populate("uploadedBy", "username")
      .sort({ createdAt: -1 });

    //console.log(`Fetched ${videos.length} videos`);

    res.status(200).json({ success: true, videos });
  } catch (err) {
    console.error("Fetch videos error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/profileVideo", isLogin, async (req, res) => {
  try {
  
    const videos = await videomodel
      .find()
      .populate("uploadedBy", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    //console.log(`Fetched ${videos.length} videos`);

    res.status(200).json({ success: true, videos });
  } catch (err) {
    console.error("Fetch videos error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
