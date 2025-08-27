const express = require("express");
const fs = require("fs");
const path = require("path");
const busboy = require("busboy");

const router = express.Router();
const videomodel = require("../../models/AdminModel/adminVideoes");
const adminmodel = require("../../models/AdminModel/admin");
const islogin = require("../../middleware/isLoggedIn");


const uploadProgress = {};

router.post("/uploadVideo", islogin, async (req, res) => {
  try {
    const adminId = req.user.adminid;
    const bb = busboy({ headers: req.headers });

    let title, tags, description;
    let thumbnailFileName = null;
    let videoFileName = null;

    let totalSize = parseInt(req.headers["content-length"] || "0", 10);
    let uploaded = 0;

    const fileWrites = [];

    bb.on("file", (fieldname, file, info) => {
      const { filename } = info;
      const saveDir =
        fieldname === "thumbnail"
          ? path.join(__dirname, "../../public/thumbnails")
          : path.join(__dirname, "../../public/videos");

      if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

      const saveTo = path.join(saveDir, filename);
      const writeStream = fs.createWriteStream(saveTo);

      if (fieldname === "thumbnail") thumbnailFileName = filename;
      if (fieldname === "video") videoFileName = filename;

     
      file.on("data", (data) => {
        uploaded += data.length;
        const percent = ((uploaded / totalSize) * 100).toFixed(2);
        uploadProgress[adminId] = percent; 
      });

      file.pipe(writeStream);

      const promise = new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });

      fileWrites.push(promise);
    });

    bb.on("field", (fieldname, val) => {
      if (fieldname === "title") title = val;
      if (fieldname === "tags") tags = val;
      if (fieldname === "description") description = val;
    });

    bb.on("close", async () => {
      await Promise.all(fileWrites);

      
      const newVideo = await videomodel.create({
        title,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        description,
        thumbnailUrl: `/thumbnails/${thumbnailFileName}`,
        videoUrl: `/videos/${videoFileName}`,
        uploadedBy: adminId,
      });

      await adminmodel.findByIdAndUpdate(adminId, {
        $push: { videoes: newVideo._id },
      });

     
      uploadProgress[adminId] = 100;

      res.status(201).json({
        success: true,
        message: "Video uploaded successfully",
        newVideo,
      });
    });

    req.pipe(bb);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/uploadProgress", islogin, (req, res) => {
  const adminId = req.user.adminid;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    const percent = uploadProgress[adminId] || 0;
    res.write(`data: ${JSON.stringify({ progress: percent })}\n\n`);
  }, 1000); 

  req.on("close", () => {
    clearInterval(interval);
  });
});

module.exports = router;
