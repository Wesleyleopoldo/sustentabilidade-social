const { sequelize, DataTypes } = require("../resources/sequelize");
const User = require("./user");

const Images = sequelize.define("images", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    legends: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        },
        onDelete: "SET NULL"
    }
});

Images.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "SET NULL"
});

module.exports = Images;