const useTry = require("./helper/error");
const defineColor = require("./helper/colors");
const { initDb } = require("./resources/db");
const app = require("./app");


require("dotenv").config();

useTry(initDb, "Erro ao sicronizar com o banco de dados...");

app.listen(process.env.PORT, () => console.log(defineColor("Servidor rodando...", "green")));