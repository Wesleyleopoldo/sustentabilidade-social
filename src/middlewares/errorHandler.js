const { AppError } = require("../helper/error");

function errorHandler(err, request, response, next) {
    const statusCode = err.statusCode || 500;

    console.log(err.statusCode);

    response.status(statusCode).json({
        success: false,
        message: err.message || "Erro interno no servidor"
    });
    console.log("Passou daqui");
}

module.exports = errorHandler