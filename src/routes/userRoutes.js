const express = require("express");

const {
  createUser,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("./../controllers/userController");
const {
  signup,
  login,
  protect,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("./../controllers/authController");

const routes = express.Router();

routes.route("/signup").post(signup);
routes.route("/login").post(login);

routes.post("/forgot-password", forgotPassword);
routes.post("/verify-otp", verifyOtp);
routes.post("/reset-password", resetPassword);

routes.route("/").get(protect, allUsers);
routes
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = routes;
