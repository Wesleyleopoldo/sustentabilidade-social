const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Sustentabilidade social",
        version: "1.0.6",
        description: "Documentação da API do projeto integrador"
    }
}

const options = {
    swaggerDefinition,
    apis: ["./src/router.js"]
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;