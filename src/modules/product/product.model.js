const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Product = sequelize.define('products', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    shop_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    category_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
    },
    description: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
    },
    profile_image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;