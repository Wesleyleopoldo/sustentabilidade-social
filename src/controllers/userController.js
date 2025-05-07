const userService = require("../services/userservice");

const createUser = async (request, response) => {
    const newUser = await userService.createUser(request.body);
    return response.status(201).json(newUser);
}

const createAdmin = async (request, response) => {
    const newAdmin = await userService.createAdmin(request.body);
    return response.status(201).json(newAdmin);
}

module.exports = {
    createUser,
    createAdmin
}