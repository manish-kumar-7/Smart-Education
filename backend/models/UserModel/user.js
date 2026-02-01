const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // Existing notes feature
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "writenote",
    },
  ],

  profilepic: {
    type: String,
  },

  role: {
    type: String,
    default: "user",
  },

  // ❤️ Videos liked by the user
  likedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],

  // 💬 Videos commented on by the user
  commentedVideos: [
    {
      video: { type: mongoose.Schema.Types.ObjectId, ref: "video" },
      commentId: { type: mongoose.Schema.Types.ObjectId }, // reference to specific comment inside Video.comments
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
