const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const Order = require(path.join(process.cwd(), "src/modules/order/order.model"));
const { DataTypes } = require('sequelize');

const OrderProduct = sequelize.define('order-products', {
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
    tableName: 'order-products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

OrderProduct.belongsTo(Product, { as: "product", foreignKey: "product_id" });
Order.hasMany(OrderProduct, { as: 'order-products', foreignKey: 'order-product_id' });
module.exports = OrderProduct;