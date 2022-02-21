const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const SubCategory = sequelize.define('sub_categories', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    category_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(255),
    }
}, {
    tableName: 'sub_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SubCategory;