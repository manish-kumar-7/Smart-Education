const express = require("express");
const router = express.Router();
const usermodel = require("../../models/UserModel/user");
const adminmodel = require("../../models/AdminModel/admin");
const usernotemodel = require("../../models/UserModel/writenote");
const adminvideomodel = require("../../models/AdminModel/adminVideoes");
const isLogin = require("../../middleware/isloginOwner");

router.get("/alluser", isLogin, async (req, res) => {
  try {
    const owner = req.user; 

   
    const alluser = await usermodel.find().select("-password"); 
    const alladmin = await adminmodel.find().select("-password");
    const allnote = await usernotemodel.find();
    const allvideo = await adminvideomodel.find();

    res.status(200).json({
      success: true,
      alladmin,
      allnote,
      alluser,
      allvideo,
    });
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all data",
      error: error.message,
    });
  }
});

module.exports = router;
