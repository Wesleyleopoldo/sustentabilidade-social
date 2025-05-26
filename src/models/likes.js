const { DataTypes, sequelize } = require("../resources/sequelize");
const User = require("./user");
const Post = require("./post");

const Likes = sequelize.define("Likes", {
    postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Post,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: "id"
        },
        allowNull: false,
        onDelete: "CASCADE"
    },
});

Likes.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Likes.belongsTo(Post, {
    foreignKey: "postId",
    onDelete: "CASCADE"
});

module.exports = Likes;