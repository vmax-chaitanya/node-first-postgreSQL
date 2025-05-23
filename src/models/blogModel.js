const { DataTypes } = require("sequelize");
// const bcrypt = require("bcryptjs");
const sequelize = require("./../../config/db");
const User = require("./userModel");

const Blog = sequelize.define(
    "Blog",
    {
        blog_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            require: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id",
            },
        },
        createdDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "blogs",
        timestamps: false,
        hooks: {
            beforeCreate: (blog) => {
                blog.createdDate = new Date();
                blog.updatedDate = new Date();
            },
            beforeUpdate: (blog) => {
                blog.updatedDate = new Date();
            },
        },
    }
);

// Define the association
Blog.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Blog, { foreignKey: "user_id" });

module.exports = Blog;
