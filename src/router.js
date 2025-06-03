const express = require("express");
<<<<<<< HEAD
=======
const validationToken = require("./middlewares/validationToken");
>>>>>>> 68df98b (Adiciona validações falta muitoooooooooooooooooooooooooo)
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const router = express.Router();

// Rotas para os recursos de usuários...
router.post("/users", userController.createUser);
router.get("/users", userController.indexAllUsers);
<<<<<<< HEAD
router.get("/users/:id", userController.getUserById);
=======
router.get("/users", validationToken,userController.getUserById);
>>>>>>> 68df98b (Adiciona validações falta muitoooooooooooooooooooooooooo)
router.post("/admin", userController.createAdmin);
router.put("/users/username", validationToken, userController.updateUsername);
router.put("/users/:id/email", userController.updateEmail);
router.put("/users/:id/password", userController.updatePassword);
router.delete("/users/:id/delete", userController.destroyUserById);

// Rotas para os recursos de posts...
router.post("/:id/posts", postController.createPost);
router.get("/posts", postController.indexAllPosts);

router.post("/:postId/:userId/comment", postController.createComment);
router.put("/:userId/:commentId/comment", postController.updateComment);

module.exports = router;