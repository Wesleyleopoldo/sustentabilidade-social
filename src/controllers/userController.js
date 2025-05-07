const userService = require("../services/userservice");

const createUser = async (request, response) => {
    const newUser = await userService.createUser(request.body);
    return response.status(201).json(newUser);
}

const createAdmin = async (request, response) => {
    const newAdmin = await userService.createAdmin(request.body);
    return response.status(201).json(newAdmin);
}

const indexAllUsers = async (_request, response) => {
    const allUsers = await userService.indexAllUsers();
    return response.status(200).json(allUsers);
}

const getUserById = async (request, response) => {
    const user = await userService.getUserById(request.params.id);
    return response.status(200).json(user);
}

module.exports = {
    createUser,
    indexAllUsers,
    getUserById,
    createAdmin
}