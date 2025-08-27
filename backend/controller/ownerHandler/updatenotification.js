const express=require("express");
const router=express.Router();
const Notification = require("../../models/AdminModel/RequestAdmin");
const Islogin=require("../../middleware/isloginOwner");
router.patch("/status",Islogin, async (req, res) => {
  try {
    const { id, status } = req.body;
    //console.log(id,status);
    if (!id || !status) {
      return res.status(400).json({ message: "ID and status are required." });
    }

    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    return res.status(200).json({
      message: "Status updated successfully",
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating status." });
  }
});
module.exports=router;