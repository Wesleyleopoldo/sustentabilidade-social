const createUserDTO = require("../dtos/userDto");
const bcrypt = require("bcryptjs");
const { tryQuery, useTry, AppError } = require("../helper/error");
const { User } = require("../resources/db");
const { DateTime } = require("luxon");

const createUser = async (body) => {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let hash = "";

    let count = 0

    for (let index = 0; index < 16; index++) {
        const charIndex = Math.floor(Math.random() * characters.length);

        if (index == count + 4) {
            hash += "-";
            count = index;
        }

        hash += characters[charIndex];
    }

    let nameFormatted = body.username.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+|-+$/g, "");

    nameFormatted += hash

    const datas = {
        slug: nameFormatted,
        picture_profile_url: body.picture_profile_url,
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password, 8),
        role: "user"
    }

    const findUser = await User.findOne({
        where: { email: datas.email }
    });

    if (findUser) {
        throw new AppError("Email já cadastrado!", 409);
    }

    const newUser = await tryQuery("Erro ao tentar criar novo usuário", () => User.create(datas));
    const newUserDto = createUserDTO({
        id: newUser.id,
        picture_profile_url: newUser.picture_profile_url,
        username: newUser.username,
    });

    return newUserDto;
}


const indexAllUsers = async () => {
    const allUsers = await tryQuery("Erro ao listar todos usuários", () => User.findAll());

    if (!allUsers.length) {
        throw new AppError("Nenhum usuário cadastrado", 404);
    }

    const allUsersDto = allUsers.map(user => createUserDTO({
        id: user.id,
        slug: user.slug,
        picture_profile_url: user.picture_profile_url,
        username: user.username,
        email: user.email,
        role: user.role
    }));

    return allUsersDto;
}

const getUserById = async (id) => {

    const user = await tryQuery("Erro ao buscar usuário", () => User.findByPk(id));

    if (!user) {
        throw new AppError("Nenhum usuário encontrado", 404);
    }

    const userDto = createUserDTO({
        id: user.id,
        picture_profile_url: user.picture_profile_url,
        username: user.username,
        email: user.email
    });

    return userDto;
}

const createAdmin = async (body) => {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let hash = "";

    let count = 0

    for (let index = 0; index < 16; index++) {
        const charIndex = Math.floor(Math.random() * characters.length);

        if (index == count + 4) {
            hash += "-";
            count = index;
        }

        hash += characters[charIndex];
    }

    let nameFormatted = body.username.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+|-+$/g, "");

    nameFormatted += hash

    const datas = {
        slug: nameFormatted,
        picture_profile_url: body.picture_profile_url,
        username: body.username,
        email: body.email,
        password: bcrypt.hashSync(body.password, 8),
        role: "adm"
    }

    const findUser = await User.findOne({
        where: { email: datas.email }
    });

    if (findUser) {
        throw new AppError("Email já cadastrado!", 409);
    }

    const admin = await tryQuery("Erro ao tentar cadastrar administrador", () => User.create(datas));

    const adminDto = createUserDTO({
        id: admin.id,
        picture_profile_url: admin.picture_profile_url,
        username: admin.username
    });

    return adminDto;
}

const updateUsername = async (id, newUserName) => {
    const findUser = await User.findByPk(id);

    if (!findUser) {
        throw new AppError("Usuário não existe na base!!", 404);
    }

    findUser.username = newUserName;
    await findUser.save();

    const userDto = createUserDTO({
        username: findUser.username
    });

    return userDto;
}

const destroyUserById = async (id) => {

    let userDeleted = null;

    const findUser = await User.findByPk(id);

    if (!findUser) {
        throw new AppError("Usuário não existe na base!!", 404);
    }

    const deletedUser = tryQuery("Erro ao deletar usuário", () => 
        User.destroy({
            where: { id: findUser.id }
        })
    );

    if (deletedUser) {
        userDeleted = { message: "Usuário deletado com sucesso!" };
    } else {
        userDeleted = { message: "Ocorreu um erro ao deletar o usuário..." };
    }

    return userDeleted;
}

const updateEmail = async (id, newEmail) => {
    const findUser = await User.findByPk(id);

    if (!findUser) {
        throw new AppError("Usuário não existe na base!!", 404);
    }

    findUser.email = newEmail;
    await findUser.save();

    const userDto = createUserDTO({
        email: findUser.email
    });

    return userDto;
}

const updatePassword = async (id, newPassword) => {
    const findUser = await User.findByPk(id);

    if (!findUser) {
        throw new AppError("Usuário não existe na base!!", 404);
    }

    const beforePassword = findUser.password;

    findUser.password = newPassword;
    await findUser.save();

    return {
        beforePassword: beforePassword,
        newPassword: findUser.password
    };
}

module.exports = {
    createUser,
    indexAllUsers,
    getUserById,
    createAdmin,
    updateUsername,
    destroyUserById,
    updateEmail,
    updatePassword,
}