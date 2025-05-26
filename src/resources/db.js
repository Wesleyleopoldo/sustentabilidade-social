const { sequelize } = require("./sequelize");

const User = require("../models/user");
const Post = require("../models/post");
const Likes = require("../models/likes");
const Comments = require("../models/comments");
const Images = require("../models/images");
const RecoveryCode = require("../models/recoverycode");

async function initDb() {
    await sequelize.sync();
    console.log("%cBanco de dados sicronizado!!!", "color: green");
}

module.exports = { sequelize, User, Post, Likes, Comments, Images, RecoveryCode, initDb };