const express=require("express");
const router=express.Router();
const chatbotapi=require("../../backend/controller/chatbot");

router.post("/api/chat",chatbotapi);
module.exports=router;