const userService = require("../services/userservice");

const createUser = async (request, response) => {
    const newUser = await userService.createUser(request.body);
    return response.status(201).json(newUser);
}

const indexAllUsers = async (_request, response) => {
    const allUsers = await userService.indexAllUsers();
    return response.status(200).json(allUsers);
}

const getUserById = async (request, response) => {
    const user = await userService.getUserById(request.user.id);
    return response.status(200).json(user);
}

const createAdmin = async (request, response) => {
    const newAdmin = await userService.createAdmin(request.body);
    return response.status(201).json(newAdmin);
}

const updateUsername = async (request, response) => {
    const updatedUsername = await userService.updateUsername(request.user.id, request.body.username);
    return response.status(200).json(updatedUsername);
}

const updateEmail = async (request, response) => {
    const updatedEmail = await userService.updateEmail(request.params.id, request.body.email);
    return response.status(201).json(updatedEmail);
}

const updatePassword = async (request, response) => {
    const updatedPassword = await userService.updatePassword(request.params.id, request.body.password);
    return response.status(201).json(updatedPassword);
}

const destroyUserById = async (request, response) => {
    const deletedUser = await userService.destroyUserById(request.params.id);
    return response.status(200).json(deletedUser);
}

module.exports = {
    createUser,
    indexAllUsers,
    getUserById,
    createAdmin,
    updateUsername,
    updateEmail,
    updatePassword,
    destroyUserById
}