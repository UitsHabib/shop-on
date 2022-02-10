const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Cart = sequelize.define('cart', {
    //   status: {
    //     type: DataTypes.ENUM,
    //     values: ['Open', 'CheckedOut'],
    //     defaultValue: 'open'
    //   },
    quantity: {
        type: DataTypes.INTEGER,
    },
    product_id: {
        type: DataTypes.INTEGER,
    },
    customer_id: {
        type: DataTypes.INTEGER,
    },
    //   total: DataTypes.DECIMAL(6, 2),
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    },

}, {
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Cart
