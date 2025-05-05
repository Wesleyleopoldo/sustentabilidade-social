const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./sustentabilidade_social.sql",
    logging: false
});

module.exports = { Sequelize, DataTypes, sequelize }