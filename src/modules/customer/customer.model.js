const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const Customer = sequelize.define('customers', {
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    address: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    phone_number: {
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
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_by',
    updatedAt: 'updated_by'
});

module.exports = Customer;