const userService = require("../services/userservice");

const createUser = async (request, response) => {
    const newUser = await userService.createUser(request.body);
    return response.status(201).json(newUser);
}

module.exports = {
    createUser
}