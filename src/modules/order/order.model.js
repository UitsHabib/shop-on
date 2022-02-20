const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');
const Customer = require(path.join(process.cwd(), "src/modules/customer/customer.model"));

const Order = sequelize.define('orders', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    customer_id:{
        allowNull: false,
        type: DataTypes.UUID
    },  
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'confirmed'],
        defaultValue: 'pending'    
    },
    delivery_status: {
        type: DataTypes.ENUM,
        values: ['process-pending', 'processing', 'success', 'failed'],
        defaultValue: 'process-pending' 
    },
    shipped_date: {
        allowNull: true,
        type: DataTypes.DATE
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.hasMany(Order, { as: 'orders', foreignKey: 'customer_id' });
Order.belongsTo(Customer, { as: 'customer', foreignKey: 'customer_id' });

module.exports = Order;