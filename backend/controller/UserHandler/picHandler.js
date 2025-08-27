const express = require("express");
const router = express.Router();
const uplode = require("../../config/multerConfig");
const isLogin = require("../../middleware/isLoggedIn");
const usermodel=require("../../models/UserModel/user");
router.post("/profile/picUplode", isLogin, uplode.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const filePath = `/images/${req.file.filename}`;
    //console.log(req.user.userid);
    // Save to user profile
   //console.log(filePath);
   const updateduser= await usermodel.findByIdAndUpdate(req.user.userid, { profilepic: filePath },{ new: true });
    //console.log("Uploaded file:", req.file);
 
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: `/images/${req.file.filename}`,
      file: req.file
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
