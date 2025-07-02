import express, { json } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  serverSideRegisterValidations,
  serverSideLoginValidations,
} from "../middlewares/Validations.middleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

//Creating Routes
router.post("/register", serverSideRegisterValidations, async (req, res) => {
  try {
    //fetching data
    const { username, email, password } = req.body;

    //Creating a new user
    const newUser = new User({
      username,
      email,
      password,
      profileImage: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${username}`,
    });
    await newUser.save();

    //Generating token
    const token = generateToken(newUser._id);

    //Sending response
    res.status(201).json({
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error in register route", error);
    res
      .status(500)
      .json({ message: "Internal server error during registration" });
  }
});

router.post("/login", serverSideLoginValidations, async (req, res) => {
  try {
    //fetching data
    const { email, password } = req.body;

    //Checking if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email Password pair does not exist" });
    }

    //Comparing hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email Password pair does not exist" });
    }

    //Generating token
    const token = generateToken(user._id);

    //Sending response
    res.status(200).json({
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

export default router;
