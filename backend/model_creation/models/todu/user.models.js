import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: True,
    unique: True,
    lowercase: True,
  },
  email: {
    type: String,
    required: unique,
    unique: True,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
},{timestamps:true}
)

export const User = mongoose.model("User", userSchema);
