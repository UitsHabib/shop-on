const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');

const Shop = sequelize.define('shops', {
    name: {
        allowNull: false,
        type: DataTypes.STRING
    },
    registration_number: {
        allowNull: false,
        type: DataTypes.STRING
    },
    user_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
}, {
    tableName: 'shops',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Shop;