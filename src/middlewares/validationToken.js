const { AppError, tryCatch } = require("../helper/error");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
require("dotenv").config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

module.exports = (request, response, next) => {
    const token = request.cookies.token;

    console.log(token)
    
    if (!token) throw new AppError("Token não fornecido", 401);

    const decode = tryCatch("Erro ao executar o verify do jwt", () => jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"]}));

    if (!decode) throw new AppError("Token inválido!!", 401);

    request.user = decode;

    next();
}