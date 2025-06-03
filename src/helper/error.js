const defineColor = require("./colors");

async function tryRun(funException, fun, ...args) {
    try {
        return await fun(...args);
    } catch (error) {
        funException(error);
    }
}

<<<<<<< HEAD
=======
function tryCatch(errorMessage, fun, ...args) {
    try {
        return fun(...args);
    } catch(error) {
        console.log(defineColor(`Algo deu errado: ${errorMessage} (${error})`, "red"));
    }
}

>>>>>>> 3acec77 (Adiciona token jwt pohaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)
async function useTry(fun, errorMessage) {
    try {
        await fun();
    } catch (error) {
        console.log(defineColor(`Algo deu errado: ${errorMessage} (${error})`, "red"));
    }
}

async function tryQuery(errorMessage, fun, ...args) {
    try {
        return await fun(...args);
    } catch(error) {
        return console.log(defineColor(`Algo deu errado: ${errorMessage} (${error})`, "red"));
    }
}

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message
        };
    }
}

module.exports = {
    tryRun,
    useTry,
    tryQuery,
    AppError
};