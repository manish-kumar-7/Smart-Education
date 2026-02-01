const express=require("express");
const app=express();

app.post("/auth/validate", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, role: decoded.role });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});
