const { sequelize } = require("./sequelize");

const User = require("../models/user");
const Post = require("../models/post");
const Comments = require("../models/comments");
const Images = require("../models/images");

async function initDb() {
    await sequelize.sync();
    console.log("%cBanco de dados sicronizado!!!", "color: green");
}

module.exports = { sequelize, User, Post, Comments, Images, initDb };