const { DataTypes } = require("sequelize");
// const bcrypt = require("bcryptjs");
const sequelize = require("./../../config/db");

const User = require("./userModel");
const UserRole = require("./userRoleModel");

const Role = sequelize.define(
    "Role",
    {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        role_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
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
        tableName: "roles",
        timestamps: false,
        hooks: {
            beforeCreate: (role) => {
                role.createdDate = new Date();
                role.updatedDate = new Date();
            },
            beforeUpdate: (role) => {
                role.updatedDate = new Date();
            },
        },
    }
);


// Role.belongsToMany(User, {
//     through: UserRole,
//     foreignKey: "role_id",
//     otherKey: "user_id",
// });
module.exports = Role;
