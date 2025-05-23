const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("./../../config/db");
const Role = require('./roleModel');
const UserRole = require('./userRoleModel');

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      //   select: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    passwordResetOtp: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    passwordResetOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    updatedDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["password", "otp"] },
    },

    hooks: {
      // Before creating a user, hash the password
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.otp = Math.floor(100000 + Math.random() * 900000);
        user.createdDate = new Date();
        user.updatedDate = new Date();
      },
      beforeUpdate: async (user) => {
        user.updatedDate = new Date();
      },
    },
  }
);

// User.prototype.generateOtp = async function () {
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   this.otp = otp;
//   await this.save();
//   return otp;
// };

// User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
// Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
});

module.exports = User;
