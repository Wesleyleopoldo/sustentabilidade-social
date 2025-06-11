const createUserDTO = require("../dtos/userDto");
const sendCode = require("../utils/sendEmails");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { tryQuery, useTry, AppError } = require("../helper/error");
const { User, RecoveryCode } = require("../resources/db");
const { DateTime } = require("luxon");

require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const login = async (email, password) => {

    console.log("Entrou no metodo login" + password)

    const findUser = await tryQuery("Erro ao buscar usuário no banco de dados!!!", () => User.findOne({
        where: { email: email }
    }));

    if(bcrypt.compareSync(password, findUser.password)) {
        console.log("A senha é igual linha 22")
    }

    if (!findUser || !bcrypt.compareSync(password, findUser.password)) {
        throw new AppError("Usuário não encontrado. Verifique o email ou se cadastre.", 401);
    }

    const token = {
        token: jwt.sign(
            { id: findUser.id },
            PRIVATE_KEY,
            { 
                expiresIn: "1h",
                algorithm: "RS256"
            }
        )
    }

    return token;
}

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
        throw new Error("Email já cadastrado!");
    }

    const newUser = await tryQuery("Erro ao tentar criar novo usuário", () => User.create(datas));
    const newUserDto = createUserDTO({
        picture_profile_url: newUser.picture_profile_url,
        username: newUser.username,
    });

    return newUserDto;
}


const indexAllUsers = async () => {
    const allUsers = await tryQuery("Erro ao listar todos usuários", () => User.findAll());

    if (!allUsers.length) {
        throw new Error("Nenhum usuário cadastrado");
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
        throw new Error("Nenhum usuário encontrado");
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
        throw new Error("Email já cadastrado!");
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
        throw new Error("Usuário não existe na base!!");
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
        throw new Error("Usuário não existe na base!!");
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
        throw new Error("Usuário não existe na base!!");
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
        throw new Error("Usuário não existe na base!!");
    }

    const beforePassword = findUser.password;

    findUser.password = newPassword;
    await findUser.save();

    return {
        beforePassword: beforePassword,
        newPassword: findUser.password
    };
}

const generateRecoveryCode = async (email) => {

    const user = await tryQuery("Erro ao buscar usuário", () => User.findOne({
        where: { email: email }
    }));

    const code = Math.floor(100000 + Math.random() * 900000);
    const createdAt = DateTime.now();
    const expiresAt = createdAt.plus({ minutes: 1 });

    const datas = {
        userId: user.id,
        code: code,
        createdAt: createdAt,
        expiresAt: expiresAt
    }

    if (!user) {
        throw new Error("Usuário não existe na base!!");
    }

    const savedCode = await tryQuery("Erro ao salvar código de recuperação...", () => RecoveryCode.create(datas));

    const sendedCode = await tryQuery("Erro ao enviar e-mail", () => sendCode(user.email, savedCode.code, "password"));

    return { message: "Código de recuperação enviado para o e-mail fornecido." }
}

const validatyRecoveryCode = async (slug, code) => {

}

module.exports = {
    login,
    createUser,
    indexAllUsers,
    getUserById,
    createAdmin,
    updateUsername,
    destroyUserById,
    updateEmail,
    updatePassword,
    generateRecoveryCode
}