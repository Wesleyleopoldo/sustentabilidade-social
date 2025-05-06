const defineColor = require("./colors");

async function useTry(fun, errorMessage) {
    try {
        await fun();
    } catch(error) {
        console.log(defineColor(`Algo deu errado: ${errorMessage} (${error})`, "red"));
    }
}

module.exports = useTry;