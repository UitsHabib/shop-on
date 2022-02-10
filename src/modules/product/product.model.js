const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Product = sequelize.define('products', {
    product_name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    product_image: {
        type: DataTypes.STRING(1024)
    },
    price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
    },
    description: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    category: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;