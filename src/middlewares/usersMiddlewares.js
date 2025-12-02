const { AppError, tryCatch } = require("../helper/error");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
require("dotenv").config();

const client = jwksClient({
    jwksUri: process.env.USERS_API_URL + "/service/jwks/.well-known/jwks.json",
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);

        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    })
}

function verifyTokens(request, response, next) {
    const authHeader = request.headers["authorization"];

    if (!authHeader) throw new AppError("Token não fornecido", 401);

    const token = authHeader.replace("Bearer ", "");

    tryCatch(
        "Erro ao executar o verify do jwt", () => jwt.verify(
            token, getKey, {
            algorithms: ["RS256"],
            issuer: "sustentabilidade-social"
        },
            (err, decoded) => {
                if (err) {
                    console.error("JWT ERROR:", err);
                    throw new AppError("Token inválido", 401);
                }

                request.user = decoded;
                next();

            }
        )
    );
}

module.exports = {
    verifyTokens
}