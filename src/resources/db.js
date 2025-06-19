const { sequelize } = require("./sequelize");

const User = require("../models/user");

async function initDb() {
    await sequelize.sync();
    console.log("%cBanco de dados sicronizado!!!", "color: green");
}

module.exports = { sequelize, User, initDb };