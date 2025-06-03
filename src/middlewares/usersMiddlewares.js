const { AppError, tryCatch } = require("../helper/error");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

function verifyTokens(request, response, next) {
    const authHeader = request.headers.authorization;
    const token = authHeader.split(" ")[1];

    console.log(authHeader)
    
    if (!authHeader) throw new AppError("Token não fornecido", 401);

    const decode = tryCatch("Erro ao executar o verify do jwt", () => jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"]}));

    request.user = decode;

    next();
}

module.exports = {
    verifyTokens
}