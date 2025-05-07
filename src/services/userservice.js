const createUserDTO = require("../dtos/userDto");
const { tryQuery, useTry } = require("../helper/error");
const { User } = require("../resources/db");

const createUser = async (body) => {

    const datas = {
        picture_profile_url: body.picture_profile_url,
        username: body.username,
        email: body.email,
        password: body.password,
        role: "user"
    }

    const findUser = await User.findOne({
        where: { email: datas.email }
    });

    if(findUser) {
        throw new Error("Email já cadastrado!");
    }

    const newUser = await tryQuery("Erro ao tentar criar novo usuário", () => User.create(datas));
    const newUserDto = createUserDTO({
        picture_profile_url: newUser.picture_profile_url,
        username: newUser.username,
    });

    return newUserDto;
}

const createAdmin = async (body) => {

    const datas = {
        picture_profile_url: body.picture_profile_url,
        username: body.username,
        email: body.email,
        password: body.password,
        role: "adm"
    }

    const findUser = await User.findOne({
        where: { email: datas.email }
    });

    if(findUser) {
        throw new Error("Email já cadastrado!");
    }

    const admin = await tryQuery("Erro ao tentar cadastrar administrador", () => User.create(datas));

    const adminDto = createUserDTO({
        picture_profile_url: admin.picture_profile_url,
        username: admin.username
    });

    return adminDto;
}

module.exports = {
    createUser,
    createAdmin
}