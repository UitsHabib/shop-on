const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Category = sequelize.define('categories', {
    shop_id: {      // Foreign key of shops table
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING(50)
    },
    description: {
        type: DataTypes.STRING(500)
    }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Category;