const express = require("express");
const User = require("./../models/userModel");
const Role = require("./../models/roleModel");
const UserRole = require("./../models/userRoleModel");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const sendEmail = require("./../../utils/email");
// Create role
exports.createRole = async (req, res) => {
    try {
        const { role_name } = req.body;
        const role = await Role.create({ role_name });

        res.status(201).json({
            status: "success",
            message: "Role created successfully",
            data: {
                role,
            },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({
            status: "success",
            message: "Roles retrieved successfully",
            roles,

        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role)
            return res.status(404).json({
                status: "error",
                message: "Role not found",
            });

        res.status(200).json({
            status: "success",
            message: "Role retrieved successfully",
            data: {
                role,
            },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Update role
exports.updateRole = async (req, res) => {
    try {
        // console.log(`${req.params.id} and ${typeof req.params.id}`);
        const id = req.params.id * 1;
        const role = await Role.findByPk(id);
        if (!role)
            return res.status(404).json({
                status: "error",
                message: "Role not found",
            });

        await role.update({ role_name: req.body.role_name });
        res.status(200).json({
            status: "success",
            message: "Role updated successfully",
            data: {
                role,
            },
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.errors });
    }
};

// Delete role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role)
            return res.status(404).json({
                status: "error",
                message: "Role not found",
            });

        await role.destroy();
        res.status(204).json({
            status: "success",
            message: "Role deleted successfully",

        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


exports.assignRoleToUser = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

        // Validate user and role exist
        const user = await User.findByPk(user_id);
        const role = await Role.findByPk(role_id);

        if (!user || !role) {
            return res.status(404).json({
                status: "error",
                message: "User or Role not found",
            });
        }

        // Check if role is already assigned
        const existing = await UserRole.findOne({ where: { user_id, role_id } });
        if (existing) {
            return res.status(400).json({
                status: "error",
                message: "Role already assigned to this user",
            });
        }

        // Create assignment
        const userRole = await UserRole.create({ user_id, role_id });

        return res.status(200).json({
            status: "success",
            message: "Role assigned to user successfully",
            data: {
                userRole,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

exports.getUsersWithRoles = async (req, res) => {
    console.log('hi');

    try {
        const users = await User.findAll({
            include: [
                {
                    model: Role,
                    through: { attributes: [] }, // exclude the join table fields
                    attributes: ["role_id", "role_name"],
                },
            ],
            attributes: {
                exclude: ["password", "otp", "passwordResetOtp", "passwordResetOtpExpires"],
            },
        });

        res.status(200).json({
            status: "success",
            message: "Users with roles fetched successfully",
            data: {
                users,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
