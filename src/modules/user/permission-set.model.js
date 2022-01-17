const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Permission = sequelize.define('permissions', {
    title: {
        type: DataTypes.STRING(50)
    },
    type: {
        type: DataTypes.ENUM,
        values: ["standard", "custom"],
        defaultValue: "custom"
    },
    description:{
        type:DataTypes.STRING(500),
    },
    created_by: {
        type: DataTypes.UUID
    },
    updated_by: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Permission;