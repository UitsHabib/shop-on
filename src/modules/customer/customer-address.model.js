const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');
const { Customer } = require(path.join(process.cwd(), "src/modules/customer/customer.model"));


const CustomerAddress = sequelize.define('customer_address', {
    customer_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    home:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    street:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    city:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    state:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    zip:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country:{
        type: DataTypes.STRING(100),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'customer_address',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.belongsTo(CustomerAddress, { foreignKey: 'customer_id' });
CustomerAddress.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = CustomerAddress;