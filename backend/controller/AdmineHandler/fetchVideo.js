const express = require("express");
const router = express.Router();
const videomodel = require("../../models/AdminModel/adminVideoes"); 
const isLogin = require("../../middleware/isLoggedIn");

router.get("/fetchVideos", isLogin, async (req, res) => {
 // console.log(req.user.adminid);
  try {
    const videos = await videomodel
      .find({uploadedBy: req.user.adminid})
      .populate("uploadedBy", "username profilepic") // ✅ include profilepic
      .populate([
        {
          path: "comments.user",
          select: "username profilepic"
        },
        {
          path: "comments.admin",
          select: "username profilepic"
        }
      ])
      .populate("likes", "username profilepic") // ✅ include profilepic
      .sort({ createdAt: -1 })
      

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
      .populate("uploadedBy", "username profilepic") // ✅ include profilepic
      .populate([
        {
          path: "comments.user",
          select: "username profilepic"
        },
        {
          path: "comments.admin",
          select: "username profilepic"
        }
      ])
      .populate("likes", "username profilepic") // ✅ include profilepic
      .sort({ createdAt: -1 })
      

    res.status(200).json({ success: true, videos });
  } catch (err) {
    console.error("Fetch videos error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = router;
