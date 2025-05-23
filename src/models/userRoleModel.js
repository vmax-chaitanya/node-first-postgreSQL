const { DataTypes } = require("sequelize");
// const bcrypt = require("bcryptjs");
const sequelize = require("./../../config/db");

const UserRole = sequelize.define(
    "UserRole",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "role_id",
            },
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
        tableName: "user_roles",
        timestamps: false,
        hooks: {
            beforeCreate: (userRole) => {
                userRole.createdDate = new Date();
                userRole.updatedDate = new Date();
            },
            beforeUpdate: (userRole) => {
                userRole.updatedDate = new Date();
            },
        },
    }
);

module.exports = UserRole;
