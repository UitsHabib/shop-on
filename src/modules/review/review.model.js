const bcrypt = require("bcrypt");
const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");

const Review = sequelize.define("reviews", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    customer_id: {
        type: DataTypes.UUID
    },
    product_id: {
        type: DataTypes.UUID
    },
    rating: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING(500)
    },
    created_by: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Review;
