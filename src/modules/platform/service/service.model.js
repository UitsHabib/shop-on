const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require('sequelize');

const service = sequelize.define('services', {
    title: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    slug: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    },
}, {
    tabletitle: 'services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = service;