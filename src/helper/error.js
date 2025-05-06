const defineColor = require("./colors");

async function useTry(fun, errorMessage) {
    try {
        await fun();
    } catch(error) {
        console.log(`%cAlgo deu errado: ${errorMessage} (${error})`, defineColor("red"));
    }
}

module.exports = useTry;