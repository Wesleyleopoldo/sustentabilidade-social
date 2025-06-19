const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API usuário",
            version: "1.0.2",
            description: "Documentação da Atividade CRUD FINAL da Disciplina de Eletiva.",
        },
        servers: [
            {
                url: "http://localhost:3000"
            },
        ],
    },
    apis: ["./src/router.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;