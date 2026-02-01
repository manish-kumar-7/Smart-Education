const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Video = require("../../models/AdminModel/adminVideoes");
const verifyUser = require("../../middleware/isLoggedIn");
const User = require("../../models/UserModel/user");
const Admin = require("../../models/AdminModel/admin");

// ======================
// 👍 Like / Unlike Video
// ======================
router.post("/:id/like", verifyUser, async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.userid ? new mongoose.Types.ObjectId(req.user.userid) : null;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

    if (!userId) {
      return res.status(403).json({ success: false, message: "Only users can like videos" });
    }

    const alreadyLiked = video.likes.some((id) => id && id.equals(userId));

    if (alreadyLiked) {
      // Unlike
      video.likes = video.likes.filter((id) => id && !id.equals(userId));
      await User.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } });
    } else {
      // Like
      video.likes.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { likedVideos: videoId } });
    }

    await video.save();

    res.json({
      success: true,
      likesCount: video.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================
// 💬 Add Comment (User OR Admin)
// ======================
router.post("/:id/comment", verifyUser, async (req, res) => {
  try {
    const videoId = req.params.id;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

    // New comment
    const newComment = {
      text,
      createdAt: new Date(),
    };

    // Attach user or admin
    if (req.user.userid) {
      newComment.user = req.user.userid;
    } else if (req.user.adminid) {
      newComment.admin = req.user.adminid;
    } else {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Push and save
    video.comments.push(newComment);
    await video.save();

    const addedComment = video.comments[video.comments.length - 1];

    // Update User/Admin commentedVideos
    if (req.user.userid) {
      await User.findByIdAndUpdate(req.user.userid, {
        $push: { commentedVideos: { video: videoId, commentId: addedComment._id } },
      });
    } else if (req.user.adminid) {
      await Admin.findByIdAndUpdate(req.user.adminid, {
        $push: { commentedVideos: { video: videoId, commentId: addedComment._id } },
      });
    }

    // Populate
    await video.populate([
      { path: "comments.user", select: "username profilepic" },
      { path: "comments.admin", select: "username profilepic" },
    ]);

    const populatedComment = video.comments.id(addedComment._id);

    res.json({
      success: true,
      comment: {
        id: populatedComment._id,
        text: populatedComment.text,
        user: populatedComment.user
          ? {
              id: populatedComment.user._id,
              username: populatedComment.user.username,
              profilepic: populatedComment.user.profilepic,
            }
          : {
              id: populatedComment.admin._id,
              username: populatedComment.admin.username,
              profilepic: populatedComment.admin.profilepic,
            },
        createdAt: populatedComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================
// 📜 Get All Comments
// ======================
router.get("/:id/comments", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate([
      { path: "comments.user", select: "username profilepic" },
      { path: "comments.admin", select: "username profilepic" },
    ]);

    if (!video) return res.status(404).json({ success: false, message: "Video not found" });

    res.json({
      success: true,
      comments: video.comments.map((c) => ({
        id: c._id,
        text: c.text,
        user: c.user
          ? {
              id: c.user._id,
              username: c.user.username,
              profilepic: c.user.profilepic,
            }
          : {
              id: c.admin._id,
              username: c.admin.username,
              profilepic: c.admin.profilepic,
            },
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get Comments Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//views
router.post("/:id/view", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment views by 1
      { new: true }
    );
    res.json({ success: true, views: video.views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
