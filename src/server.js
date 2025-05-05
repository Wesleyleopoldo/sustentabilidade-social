const { initDb } = require("./resources/db");
const { useTry } = require("./helper/error");
const app = require("./app");


require("dotenv").config();

useTry(initDb, "Erro ao sicronizar com o banco de dados...");

app.listen(process.env.PORT, () => console.log("Servidor rodando..."));