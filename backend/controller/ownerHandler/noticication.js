const express=require("express");
const router=express.Router();
const requestmodel=require("../../models/AdminModel/RequestAdmin");
const Islogin=require("../../middleware/isloginOwner");

router.get('/notification',Islogin, async (req, res) => {
  try {
    const { date } = req.query;

    
    const targetDate = date ? new Date(date) : new Date();

   
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const notifications = await requestmodel.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports=router;