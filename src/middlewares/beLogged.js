const { AppError, tryCatch } = require("../helper/error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PUBLIC_KEY = process.env.PUBLIC_KEY;

module.exports = (request, response, next) => {
    const token = request.cookies.token;
    
    if (!token) {
        const user = {
            id: null
        }
        request.user = user;
        return next();
    }

    const decode = tryCatch("Erro ao executar o verify do jwt", () => jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"]}));

    if (!decode) throw new AppError("Token inválido!!", 401);

    request.user = decode;

    next();
}