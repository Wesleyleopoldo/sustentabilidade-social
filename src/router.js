const express = require("express");
const validationToken = require("./middlewares/validationToken");
const userController = require("./controllers/userController");
const router = express.Router();

/**
 * @swagger
 * /users:
 *  post:
 *      summary: Rota para criar usuário.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         picture_profile_url:
 *                             type: string
 *                             format: binary
 *                         username:
 *                             type: string
 *                             example: Silvio Monte
 *                         email:
 *                             type: string
 *                             example: silvio.monte@gmail.com
 *                         password:
 *                             type: string
 *                             example: senhaforte123
 * 
 *      responses:
 *          201:
 *              description: Ela retorna foto e nome de usuário...
 */
router.post("/users", userController.createUser);
/**
 * @swagger
 * /users/allusers:
 *  get:
 *      summary: Rota para obter todos usuários.
 *      responses:
 *          200:
 *              description: Ela retorna id, slug, foto de usuário, nome de usuário email e privilégio...
 */
router.get("/users/allusers", userController.indexAllUsers);
/**
 * @swagger
 * /{id}/users:
 *  get:
 *      summary: Rota para obter um usuário pelo id.
 *      parameters:
 *          - in: path
 *            name: uuid
 *            required: true
 *            description: UUID do usuário
 *            schema:
 *            type: string
 *            format: uuid
 *      responses:
 *          200:
 *              description: Ela retorna id, foto de usuário, nome de usuário e email...
 */
router.get("/:id/users", userController.getUserById);
/**
 * @swagger
 * /admin:
 *  post:
 *      summary: Rota para criar um usuário administrador.
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         picture_profile_url:
 *                             type: string
 *                             format: binary
 *                         username:
 *                             type: string
 *                             example: Silvio Monte
 *                         email:
 *                             type: string
 *                             example: silvio.monte@gmail.com
 *                         password:
 *                             type: string
 *                             example: senhaforte123
 *      responses:
 *          201:
 *              description: Ela retorna id, foto de usuário e nome de usuário...
 */
router.post("/admin", userController.createAdmin);
/**
 * @swagger
 * /users/{id}/username:
 *  put:
 *      summary: Rota para alterar nome de usuário pelo id.
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: uuid
 *            required: true
 *            description: UUID do usuário
 *            schema:
 *            type: string
 *            format: uuid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         username:
 *                             type: string
 *                             example: Silvio Monte
 *      responses:
 *          200:
 *              description: Ela retorna o novo nome de usuário...
 */
router.put("/users/:id/username", validationToken, userController.updateUsername);
/**
 * @swagger
 * /users/{id}/email:
 *  put:
 *      summary: Rota para alterar o email do usuário pelo id.
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: uuid
 *            required: true
 *            description: UUID do usuário
 *            schema:
 *            type: string
 *            format: uuid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         email:
 *                             type: string
 *                             example: silvio.monte@gmail.com
 *      responses:
 *          200:
 *              description: Ela retorna o novo email do usuário...
 */
router.put("/users/:id/email", userController.updateEmail);
/**
 * @swagger
 * /users/{id}/password:
 *  put:
 *      summary: Rota para alterar o email do usuário pelo id.
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: uuid
 *            required: true
 *            description: UUID do usuário
 *            schema:
 *            type: string
 *            format: uuid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                     type: object
 *                     properties:
 *                         password:
 *                             type: string
 *                             example: senhaforte123
 *      responses:
 *          200:
 *              description: Ela retorna uma mensagem de sucesso para o usuário...
 */
router.put("/users/:id/password", userController.updatePassword);
/**
 * @swagger
 * /users/{id}/delete:
 *  put:
 *      summary: Rota para deletar usuário pelo id.
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: uuid
 *            required: true
 *            description: UUID do usuário
 *            schema:
 *            type: string
 *            format: uuid
 *      responses:
 *          200:
 *              description: Ela retorna uma mensagem de sucesso para o usuário...
 */
router.delete("/users/:id/delete", userController.destroyUserById);

module.exports = router;