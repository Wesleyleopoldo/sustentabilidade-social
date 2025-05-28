const { AppError } = require("../helper/error");

function errorHandler(err, request, response, next) {
    const statusCode = err.statusCode || 500;

    response.status(statusCode).json({
        success: false,
        message: "Erro interno no servidor"
    });
}

module.exports = errorHandler