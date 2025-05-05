const { sequelize, DataTypes } = require("../resources/sequelize");
const Post = require("./post");
const User = require("./user");

const Comments = sequelize.define("comments", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "CASCADE"
    },

    postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Post,
            key: "id"
        },
        onDelete: "CASCADE"
    },

    content: {
        type: DataTypes.STRING,
        allowNull: false
    },

    dateTime: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

Comments.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Comments.belongsTo(Post, {
    foreignKey: "postId",
    onDelete: "CASCADE"
});

module.exports = Comments;