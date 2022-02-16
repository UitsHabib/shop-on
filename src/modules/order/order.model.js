const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');
const Customer = require(path.join(process.cwd(), "src/modules/platform/customer/customer.model"));
const Product = require(path.join(process.cwd(), "src/modules/platform/product/product.model"));

const Order = sequelize.define('orders', {
    customer_id:{
        allowNull: false,
        type: DataTypes.INTEGER
    },  
    total_price: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    staus: {
        type: DataTypes.ENUM,
        values: ['pending', 'confirmed'],
        defaultValue: 'pending'    
    },
    delivery_status: {
        type: DataTypes.ENUM,
        values: ['process-pending', 'processing', 'success', 'failed'],
        defaultValue: 'process-pending' 
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.hasMany(Order, { as: 'orders', foreignKey: 'order_id' });
Order.belongsTo(Customer, { as: 'customer', foreignKey: 'customer_id' });

const OrderModel = new Order;
module.exports = OrderModel;