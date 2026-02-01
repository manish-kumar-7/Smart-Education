const express = require("express");
const router = express.Router();
const Videomodel = require("../../models/AdminModel/adminVideoes");
const Islogin = require("../../middleware/isLoggedIn");

router.put('/editVideo', Islogin, async (req, res) => {
  const { videoId, title, tags, description } = req.body;

  if (!videoId || !title || !description) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }

  try {
    const updateData = {
      title,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
      description,
    };

    const updatedVideo = await Videomodel.findByIdAndUpdate(videoId, updateData, { new: true });

    if (!updatedVideo) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, video: updatedVideo, message: 'Video updated successfully' });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ success: false, message: 'Server error while updating video' });
  }
});

module.exports = router;
