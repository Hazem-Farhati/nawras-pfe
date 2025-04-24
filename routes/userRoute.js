const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const {
  loginRules,
  registerRules,
  Validation,
} = require("../middleware/auth-validator");
const isAuth = require("../middleware/passport");

const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "ahmedmami940@gmail.com",
    pass: "zyrl oxva xpbq ueld",
  },
});
// ********************************** REGISTER *****************************
userRouter.post("/register", registerRules(), Validation, async (req, res) => {
  const { username, nom, prenom, email, password, role, activationToken } =
    req.body;
  try {
    const newUser = new User(req.body);
    //check if email exist
    const searchedUser = await User.findOne({ email });
    if (searchedUser) {
      return res.status(400).send({ msg: "email already exist" });
    }
    //hash password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    // newUser.password = hashedPassword;
    // console.log(hashedPassword);
    newUser.password = hashedPassword;
    //creat verificationToken
    const activationToken = jwt.sign({ email }, process.env.SecretOrKey, {
      expiresIn: "1d",
    });
    //save user
    newUser.activationToken = activationToken;

    const result = await newUser.save();
    // Send verification email
    const verificationUrl = `http://localhost:3000/verify-account/${activationToken}`;
    const mailOptions = {
      from: "ahmedmami940@gmail.com",
      to: email,
      subject: "Verify Your Account",
      text: `To verify your account, please click the following link: ${verificationUrl}`,
    };
    await transporter.sendMail(mailOptions);
    //************end Send verification email */
    //generate a token
    const payload = {
      _id: result._id,
      name: result.name,
    };
    require("dotenv").config();
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: "1d",
    });
    //**********
    res.send({
      user: result,
      msg: "user is saved",
      token: `Bearer ${token}`,
    });
  } catch (error) {
    res.send("can not save the user");
    console.log(error);
  }
});
// ********************************** END REGISTER *****************************
//******************Create endpoint for verifying account***********************
userRouter.post("/verify-account/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token

    const user = await User.findOne({
      activationToken: token,
      isActivated: false,
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    // Verify user account
    user.isActivated = true;
    user.activationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
//*************end Create endpoint for verifying account*****************

// ********************************** LOGIN *****************************
userRouter.post("/login", loginRules(), Validation, async (req, res) => {
  const { email, password } = req.body;
  try {
    //fin of the user exist
    const searchedUser = await User.findOne({ email });
    //if the email not exist
    if (!searchedUser) {
      return res.status(400).send({ msg: "bad credential" });
    }
    //password are
    const match = await bcrypt.compare(password, searchedUser.password);

    if (!match) {
      return res.status(400).send({ msg: "bad credential" });
    }
    //cree un token
    const payload = {
      _id: searchedUser.id,
      nom: searchedUser.nom,
    };
    const token = await jwt.sign(payload, process.env.SecretOrKey, {
      expiresIn: 1000 * 3600 * 24,
    });
    console.log(token);
    //send the user
    res
      .status(200)
      .send({ user: searchedUser, msg: "success", token: `Bearer ${token}` });
  } catch (error) {
    res.send({ msg: "can not get th user" });
  }
});
// ********************************** END LOGIN *****************************

// *********************************** CURRENT USER **********************
userRouter.get("/current", isAuth(), (req, res) => {
  res.status(200).send({ user: req.user });
});
// *********************************** END CURRENT USER **********************

//get all users
userRouter.get("/all", async (req, res) => {
  try {
    let result = await User.find();
    res.send({
      users: result,
      msg: "all users",
    });
  } catch (error) {
    console.log(error);
  }
});

///get  users by id
userRouter.get("/getbyid/:id", async (req, res) => {
  try {
    let result = await User.findById(req.params.id);
    res.send({
      users: result,
      msg: "this is user by id",
    });
  } catch (error) {
    console.log(error);
  }
});

//update user by id

userRouter.put("/update/:id", async (req, res) => {
  try {
    let result = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.send({ newUser: result, msg: "User updated" });
  } catch (error) {
    console.log(error);
  }
});

//delete user

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    let result = await User.findByIdAndDelete(req.params.id);
    res.send({ msg: "user is delete" });
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    // Generate a unique reset token
    const resetToken = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    // Update user's reset token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email to the user with the reset link containing the token
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: "hazemfarhati@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `To reset your password, please click the following link: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.send({ msg: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
userRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by reset token and ensure it hasn't expired
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    // If user not found or token expired
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Reset password
    const salt = 10;
    const genSalt = await bcrypt.genSalt(salt);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = userRouter;
