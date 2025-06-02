const { AppError, tryCatch } = require("../helper/error");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const PUBLIC_KEY = fs.readFileSync("./public.key");

function verifyTokens(request, response, next) {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ");
    
    if (!authHeader) throw new AppError("Token não fornecido", 401);

    tryCatch("Erro ao executar o verify do jwt", () => jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"]}));

    request.user = payload;

    next();
}

module.exports = {
    verifyTokens
}