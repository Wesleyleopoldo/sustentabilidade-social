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
 *                             type: imagem-inserida
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
 *          409:
 *              description: Retorna um erro se o email fornecido já tiver sido cadastrado...
 */
router.post("/users", userController.createUser);
/**
 * @swagger
 * /users/allusers:
 *  get:
 *      summary: Rota para obter todos usuários.
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Ela retorna id, slug, foto de usuário, nome de usuário email e privilégio...
 *              links:
 *                  getUserById:
 *                      operationId: getUser
 *                      parameters:
 *                          id: '$response.body#/id'
 *          404:
 *              description: Retorna um erro se nenhum usuário for encontrado...
 */
router.get("/users/allusers", userController.indexAllUsers);
/**
 * @swagger
 * /{id}/users:
 *  get:
 *      operationId: getUser
 *      summary: Rota para obter um usuário pelo id.
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
 *              description: Ela retorna id, foto de usuário, nome de usuário e email...
 *          404:
 *              description: Retorna um erro se o usuário não for encontrado...
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
 *          409:
 *              description: Retorna um erro de conflito se o email já for cadastrado...
 */
router.post("/admin", userController.createAdmin);
/**
 * @swagger
 * /users/{id}/username:
 *  put:
 *      operationId: putUsername
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
 *          404:
 *              description: Retorna um erro se o usuário não for encontrado...
 */
router.put("/users/:id/username", validationToken, userController.updateUsername);
/**
 * @swagger
 * /users/{id}/email:
 *  put:
 *      operationId: putEmail
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
 *          404:
 *              description: Retorna um erro se o usuário não for encontrado...
 */
router.put("/users/:id/email", userController.updateEmail);
/**
 * @swagger
 * /users/{id}/password:
 *  put:
 *      operationId: putPassword
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
 *          404:
 *              description: Retorna um erro se o usuário não for encontrado...
 */
router.put("/users/:id/password", userController.updatePassword);
/**
 * @swagger
 * /users/{id}/delete:
 *  delete:
 *      operationId: destroyUser
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
 *          404:
 *              description: Retorna um erro se o usuário não for encontrado...
 */
router.delete("/users/:id/delete", userController.destroyUserById);

module.exports = router;