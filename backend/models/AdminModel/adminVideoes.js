// const mongoose = require("mongoose");

// const videoSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true
//    },
//   tags: [{
//      type: String 
//     }],
//   description: { 
//     type: String 
//   },
//   thumbnailUrl: { 
//     type: String, required: true
//    },
//   videoUrl: { 
//     type: String, required: true
//    },
//   uploadedBy: { 
//     type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true
//    },
//   uploadedAt: {
//      type: Date, default: Date.now
//      }
// });


// module.exports = mongoose.model("Video", videoSchema);


const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },

  // Admin who uploaded
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },

  // ❤️ Likes (store userIds who liked it)
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],

 
comments: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    text: String,
    createdAt: { type: Date, default: Date.now },
    postedBy: {
      type: String,
      enum: ["user", "admin"], // helps frontend know who wrote it
    },
  }
],
views: {
    type: Number,
    default: 0,
  }



});

module.exports = mongoose.model("Video", videoSchema);
