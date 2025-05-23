const express = require("express");

// const {
//     createUser,
//     allUsers,
//     getUser,
//     updateUser,
//     deleteUser,
// } = require("./../controllers/userController");
const {
    signup,
    login,
    protect,
    forgotPassword,
    verifyOtp,
    resetPassword,
} = require("./../controllers/authController");

const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('./../controllers/blogController')

const routes = express.Router();

routes.post("/", protect, createBlog);
routes.get("/", protect, getAllBlogs);
routes.get("/:id", protect, getBlogById);
routes.put("/:id", protect, updateBlog);
routes.delete("/:id", protect, deleteBlog);

module.exports = routes;
