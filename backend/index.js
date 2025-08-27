const express=require("express");
const app=express();
const cookieParser = require('cookie-parser');
const path=require("path");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());

app.use("/images", express.static("public/images"));
app.use("/thumbnails", express.static("public/thumbnails"));
app.use("/videos", express.static("public/videos"));

require("dotenv").config();
const PORT=process.env.PORT;
const cors = require('cors');
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true              
}));
//user related require modules

const dbConnection=require("./models/dbConnection");
const signup=require("./router/userRouter/signup");
const login=require("./router/userRouter/login");
const logout=require("./router/userRouter/logout");
const isLoggedIn=require("./middleware/isLoggedIn");
const writenote=require("./router/userRouter/writenotes");
const account=require("./router/userRouter/account");
const updateProfile=require("./router/userRouter/updateProfileImage");
const picUplode=require("./router/userRouter/picUplode");
//user related routes

app.post("/signup",signup);
app.post("/login",login);
app.get("/logout",logout);
app.get("/auth",isLoggedIn,(req,res)=>{res.status(201).json({message:"Authorized",user:req.user,success:true});});
app.post("/profile/id",writenote);
app.get("/profile/file",writenote);
app.put("/profile/update",updateProfile);
app.delete("/profile/file/:id",writenote);
app.get("/profile/user",account);
app.post("/profile/picUplode",picUplode);
//admin related modules
const adminSignup=require("./router/admineRouter/admineSignup");
const adminLogin=require("./router/admineRouter/adminLogin");
const adminAccount=require("./router/admineRouter/adminAccount");
const adminAccountUpdate=require("./router/admineRouter/accountUpdate");
const UplodeVideo=require("./router/admineRouter/UplodeVideo");
const fetchVideo=require("./router/admineRouter/fetchVideo");
const deleteVideo=require("./router/admineRouter/deleteVideo");
const editVideo=require("./router/admineRouter/editVideo");
const uservideo=require("./router/admineRouter/UserVideo");
const requestAdmin=require("./router/admineRouter/RequestAdmin");
//admin related routes
app.post("/admin/signup",adminSignup);
app.post("/admin/login",adminLogin);
app.get("/adminDashboard/account",adminAccount);
app.put("/Adminprofile/update",adminAccountUpdate);
app.post("/uploadVideo",UplodeVideo);
app.get("/fetchVideos",fetchVideo);
app.get("/profileVideo",uservideo);
app.delete("/deleteVideo",deleteVideo);
app.put("/editVideo",editVideo);
app.post("/adminAccess",requestAdmin)

//owner related module
const alluser=require("./router/owner/allusers");
const deleteVid=require("./router/owner/deleteVideo");
const deleteUser=require("./router/owner/deleteUser");
const deletAdmin=require("./router/owner/deleteAdmin");
const notification=require("./router/owner/notification");
const updatestatus=require("./router/owner/updateStatus");
//owner related routes
app.get("/alluser",alluser);
app.delete("/deleteVid",deleteVid);
app.delete("/deleteUser",deleteUser);
app.delete("/deleteAdmin",deletAdmin);
app.get("/notification",notification);
app.patch("/status",updatestatus);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));