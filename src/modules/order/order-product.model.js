const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const OrderProduct = sequelize.define('order_products', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    order_id: {  
        allowNull: false,
        type: DataTypes.INTEGER
    },
    product_id: {
        allowNull: false,        
        type: DataTypes.INTEGER
    },
    quantity: {
        allowNull: false,        
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'order_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = OrderProduct;