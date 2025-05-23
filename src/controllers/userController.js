const express = require("express");
const User = require("./../models/userModel");
const catchAsync = require("./../../utils/catchAsync");

exports.allUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error`,
    });
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  try {
    const id = req.params.id * 1;
    //   console.log(req.params.id);
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({
        status: "error",
        message: `user not found for ${id}`,
      });

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error`,
    });
  }
});

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id * 1;
    // console.log(req.params.id);
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({
        status: "error",
        message: `user not found for ${id}`,
      });
    const updatedRows = await User.update(req.body, {
      where: { user_id: id },
    });

    res.status(200).json({
      message: "success updated",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error`,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.destroy({ where: { user_id: id } });
    res.status(204).json({
      message: "success deleted",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `Internal server error`,
    });
  }
};
