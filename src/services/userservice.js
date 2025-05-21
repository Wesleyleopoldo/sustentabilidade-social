const createUserDTO = require("../dtos/userDto");
const sendCode = require("../utils/sendEmails");
const { tryQuery, useTry } = require("../helper/error");
const { User, RecoveryCode } = require("../resources/db");
const { DateTime } = require("luxon");

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


const indexAllUsers = async () => {
    const allUsers = await tryQuery("Erro ao listar todos usuários", () => User.findAll());
    
    if(!allUsers.length) {
        throw new Error("Nenhum usuário cadastrado");
    }
    
    const allUsersDto = allUsers.map(user => createUserDTO({
        id: user.id,
        picture_profile_url: user.picture_profile_url,
        username: user.username,
        email: user.email,
        role: user.role
    }));
    
    return allUsersDto;
}

const getUserById = async (id) => {

    const user = await tryQuery("Erro ao buscar usuário", () => User.findByPk(id));
    
    if(!user) {
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
        id: admin.id,
        picture_profile_url: admin.picture_profile_url,
        username: admin.username
    });

    return adminDto;
}

const updateUsername = async (id, newUserName) => {
    const findUser = await User.findByPk(id);

    if(!findUser) {
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

    const userDeleted = null

    const findUser = await User.findByPk(id);

    if(!findUser) {
        throw new Error("Usuário não existe na base!!");
    }

    const deletedUser = tryQuery("Erro ao deletar usuário", await User.destroy({
        where: { id: findUser.id }
    }));

    if(deletedUser) {
        userDeleted = "Usuário deletado com sucesso!";
    } else {
        userDeleted = "Ocorreu um erro ao deletar o usuário...";
    }

    return userDeleted;
}

const updateEmail = async (id, newEmail) => {
    const findUser = await User.findByPk(id);

    if(!findUser) {
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

    if(!findUser) {
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

    if(!user) {
        throw new Error("Usuário não existe na base!!");
    }

    const savedCode = await tryQuery("Erro ao salvar código de recuperação...", () => RecoveryCode.create(datas));

    const sendedCode = await tryQuery("Erro ao enviar e-mail", () => sendCode(user.email, savedCode.code, "password"));

    return { message: "Código de recuperação enviado para o e-mail fornecido." }
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
    generateRecoveryCode
}