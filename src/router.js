const express = require("express");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const router = express.Router();

// Rotas para os recursos de usuários...
router.post("/users", userController.createUser);
router.get("/users", userController.indexAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/admin", userController.createAdmin);
router.put("/users/:id/username", userController.updateUsername);
router.put("/users/:id/email", userController.updateEmail);
router.put("/users/:id/password", userController.updatePassword);
router.delete("/users/:id/delete", userController.destroyUserById);

// Rotas para os recursos de posts...
router.post("/:id/posts", postController.createPost);
router.get("/posts", postController.indexAllPosts);

module.exports = router;