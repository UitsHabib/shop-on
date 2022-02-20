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
        type: DataTypes.UUID,
        allowNull: false
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
        type: DataTypes.STRING
    },
    product_image:  {
        allowNull: false,
        type: DataTypes.STRING
    },
    category: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    product_profile_image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;