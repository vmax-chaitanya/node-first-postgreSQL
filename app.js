const express = require("express");
const dotenv = require("dotenv");

const userRouter = require("./src/routes/userRoutes");
const blogRouter = require("./src/routes/blogRoutes");
const roleRouter = require("./src/routes/roleRoutes");

dotenv.config({ path: "./config.env" });
// console.log()
const app = express();
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/roles", roleRouter);

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find the requested URL (${req.originalUrl})`, 404));
// });

// app.use(globalErrorHandler);

module.exports = app;
