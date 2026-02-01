const { GoogleGenAI } = require("@google/genai");
const express = require("express");
const router = express.Router();
const isLogin=require("../middleware/isLoggedIn");
// Initialize AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/api/chat",isLogin, async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
    });

    // The generated text is in response.text
    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
