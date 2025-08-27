const express=require("express");
const router=express.Router();

const AdminAccessmodel=require("../../models/AdminModel/RequestAdmin");


router.post("/adminAccess", async (req, res) => {
  try {
    const { username, email, phone, profession } = req.body;

    
    if (!username || !email || !phone || !profession) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }


    const existingRequest = await AdminAccessmodel.findOne({ email, status: 'pending' });
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending admin access request."
      });
    }

   
    const newRequest = await AdminAccessmodel.create({
      username,
      email,
      phone,
      profession,
      status: 'pending' 
    });

    //console.log(newRequest);

    return res.status(201).json({
      
      success: true,
      message: "Admin access request submitted successfully."
    });
  } catch (error) {
    console.error("Error in requestAdminAccess:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});

module.exports = router;
