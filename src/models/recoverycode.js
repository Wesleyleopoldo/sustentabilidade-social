const { DataTypes, sequelize } = require("../resources/sequelize");
const User = require("./user");

const RecoveryCode = sequelize.define("RecoveryCode", {
    
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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

    code: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    createdAt: {
        type: DataTypes.TIME,
        allowNull: false
    },

    expiresAt: {
        type: DataTypes.TIME,
        allowNull: false
    }
});

RecoveryCode.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

module.exports = RecoveryCode;