const express = require("express");
const validationToken = require("./middlewares/validationToken");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const router = express.Router();

// Rotas para os recursos de usuários...
router.post("/users/login", userController.login);
router.post("/users", userController.createUser);
router.get("/users", userController.indexAllUsers);
router.get("/users", validationToken,userController.getUserById);
router.post("/admin", userController.createAdmin);
router.put("/users/username", validationToken, userController.updateUsername);
router.put("/users/:id/email", userController.updateEmail);
router.put("/users/:id/password", userController.updatePassword);
router.delete("/users/:id/delete", userController.destroyUserById);

// Rotas para os recursos de posts...
router.post("/:id/posts", postController.createPost);
router.get("/posts", postController.indexAllPosts);
router.get("/:id/posts", postController.indexPost);
router.post("/:userId/:id/post/like", postController.addLikes);
router.put("/:userId/:id/post/removelike", postController.removeLike);

router.post("/:postId/:userId/comment", postController.createComment);
router.put("/:userId/:commentId/comment", postController.updateComment);
router.delete("/:userId/:commentId/removecomment", postController.destroyComment);
router.get("/:postId/comments", postController.indexAllCommentsByPostId);

module.exports = router;