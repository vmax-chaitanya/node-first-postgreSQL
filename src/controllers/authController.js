const express = require("express");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("./../../utils/email");

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.errors,
    });
  }
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.login = async (req, res, next) => {
  // console.log(signToken(1));
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["user_id", "firstName", "email", "password"],
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    console.log(user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const token = signToken(user.user_id);

    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user.user_id,
        name: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "You are not logged in. Please log in to get access.",
    });
  }
  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const currentUser = await User.findByPk(decoded.user_id);
    const currentUser = await User.findByPk(decoded.id);
    console.log(decoded);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};

// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ where: { email } });
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that email address",
      });
    }

    // const otp = generateOTP();
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes in the future (UTC time)

    // Save in UTC
    user.passwordResetOtp = otp;
    user.passwordResetOtpExpires = otpExpiry.toISOString(); // to store as UTC string
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your password reset OTP (valid for 10 min)",
      text: `Your OTP for password reset is: ${otp}`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({
      status: "success",
      message: "OTP sent to email!",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: ` err : ${err.message}`,
    });
  }
};

exports.verifyOtp = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { email } = req.body;
    // console.log(typeof otp);
    const otp = req.body.otp * 1;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.passwordResetOtp !== otp) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP",
      });
    }

    const now = new Date();
    const expiryDate = new Date(user.passwordResetOtpExpires);

    console.log("Current:", now.toISOString());
    console.log("Expires:", expiryDate.toISOString());

    if (expiryDate < now) {
      return res.status(400).json({
        status: "fail",
        message: "OTP has expired",
      });
    }

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (
      !newPassword ||
      newPassword.length < 8 ||
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords must match and be at least 8 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.passwordResetOtp = null;
    user.passwordResetOtpExpires = null;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Password reset successful",
      text: "Your password has been successfully reset.",
      html: "<H1>Your password has been successfully reset.</H1>",
    });

    // await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
