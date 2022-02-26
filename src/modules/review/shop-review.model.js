const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const Shop = require(path.join(process.cwd(), "src/modules/shop/shop.model"));
const { DataTypes } = require("sequelize");

const ShopReview = sequelize.define("shop_reviews", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    customer_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    shop_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    rating: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    comment: {
        allowNull: false,
        type: DataTypes.STRING(500)
    }
},
 {
    tableName: 'shop_reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

ShopReview.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });

module.exports = Review;