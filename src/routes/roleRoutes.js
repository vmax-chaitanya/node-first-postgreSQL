const express = require("express");

const routes = express.Router();

const { createRole, getAllRoles, getRoleById, updateRole, deleteRole, assignRoleToUser, getUsersWithRoles } = require("./../controllers/roleController");


//

routes.get("/getUsersWithRoles", getUsersWithRoles);

routes.post("/", createRole);
routes.get("/", getAllRoles);
routes.get("/:id", getRoleById);
routes.patch("/:id", updateRole);
routes.delete("/:id", deleteRole);

routes.post("/assign", assignRoleToUser);
// routes.get("/new", getAllRoles);
// 

module.exports = routes;
