// const { Sequelize } = require("sequelize");
// const dotenv = require("dotenv");
// const app = require("./app");
// dotenv.config({ path: "./config.env" });

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     port: process.env.DB_PORT,
//     logging: false,
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.error("Database connection error:", err));

// module.exports = sequelize;

// const port = process.env.PORT;
// // console.log(port);

// app.listen(port, () => {
//   console.log(`app is running in port:${port}`);
// });

const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const sequelize = require("./config/db");

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync(); // optionally force: true for dev
  })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
