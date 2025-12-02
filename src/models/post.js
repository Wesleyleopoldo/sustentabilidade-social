const { DataTypes, sequelize } = require("../resources/sequelize");
const User = require("./user");

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },

    dateTime: {
        type: DataTypes.DATE,
        allowNull: false
    },

    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Post;