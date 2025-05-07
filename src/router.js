const express = require("express");
const userController = require("./controllers/userController");
const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users", userController.indexAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/admin", userController.createAdmin);

module.exports = router;