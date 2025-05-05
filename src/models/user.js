const { DataTypes, sequelize } = require("../resources/sequelize");
const Post = require("./post");

const User = sequelize.define("User", {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.UUID,
        allowNull: false
    },

    picture_profile_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    username: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [["adm", "user"]]
        }
    }
});

module.exports = User;