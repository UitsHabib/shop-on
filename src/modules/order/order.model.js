const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');
const Customer = require(path.join(process.cwd(), "src/modules/customer/customer.model"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const OrderProduct = require(path.join(process.cwd(), "src/modules/order/order-product.model"));

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
    total_price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2)
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
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.hasMany(Order, { as: 'orders', foreignKey: 'customer_id' });
Order.belongsTo(Customer, { as: 'customer', foreignKey: 'customer_id' });
Order.hasMany(OrderProduct, { as: 'order_products', foreignKey: 'order-product_id' });
OrderProduct.belongsTo(Product, { as: "product", foreignKey: "product_id" });

const OrderModel = new Order;
module.exports = OrderModel;