const usermodel = require("../../models/UserModel/user");
const ownermodel = require("../../models/owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const owner = await ownermodel.findOneAndUpdate(
  { email },
  { $set: { role: "owner" } },
  { new: true } 
);
    //console.log(owner.role);
    if (owner) {
      
      const isMatch = await bcrypt.compare(password, owner.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password", success: false });
      }

      const token = jwt.sign(
        { email, ownerid: owner._id,},
        process.env.SECRET_OWNER_KEY,
        { expiresIn: "2h" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.status(200).json({
        message: "Owner logged in",
        success: true,
         email,
        username:owner.username,
        role:owner.role,
      });
    }

    
    const user = await usermodel.findOneAndUpdate(
  { email },
  { $set: { role: "user" } },
  { new: true } 
);
    if (!user) {
      return res.status(404).json({ message: "User not exist, please signup", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign(
      { email, userid: user._id,},
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "User logged in",
      success: true,
       email,
     username:user.username,
     role:user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
