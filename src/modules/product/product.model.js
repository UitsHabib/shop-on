const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Product = sequelize.define('products', {
    shop_id: {          // Foreign key of shops table.
        type: DataTypes.INTEGER,
    },
    category_id: {         // Foreign key of categories table.
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING(1024)
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
    },
    description: {
        type: DataTypes.STRING,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;