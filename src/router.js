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
router.put("/users/email", validationToken, userController.updateEmail);
router.put("/users/password", validationToken,userController.updatePassword);
router.delete("/users/delete", validationToken,userController.destroyUserById);

// Rotas para os recursos de posts...
router.post("/posts", validationToken, postController.createPost);
router.get("/posts", postController.indexAllPosts);
router.get("/:id/posts", postController.indexPost);
router.post("/:id/post/like", validationToken, postController.addLikes);
router.put("/:id/post/removelike", validationToken, postController.removeLike);

router.post("/:postId/comment", validationToken, postController.createComment);
router.put("/:commentId/comment", validationToken, postController.updateComment);
router.delete("/:commentId/removecomment", validationToken, postController.destroyComment);
router.get("/:postId/comments", postController.indexAllCommentsByPostId);

module.exports = router;