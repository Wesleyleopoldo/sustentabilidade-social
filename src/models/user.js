const { DataTypes, sequelize } = require("../resources/sequelize");


const User = sequelize.define("User", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },

    slug: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "undefined"
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