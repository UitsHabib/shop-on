const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');


const Order = sequelize.define('orders', {
  product_id: {
    allowNull: false,
    type: DataTypes.STRING
  },
  quantity: {
    allowNull: false,
    type: DataTypes.STRING,
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
const OrderModel = new Order;
module.exports = OrderModel;