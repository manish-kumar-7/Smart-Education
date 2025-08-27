const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true
   },
  tags: [{
     type: String 
    }],
  description: { 
    type: String 
  },
  thumbnailUrl: { 
    type: String, required: true
   },
  videoUrl: { 
    type: String, required: true
   },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true
   },
  uploadedAt: {
     type: Date, default: Date.now
     }
});


module.exports = mongoose.model("Video", videoSchema);
