const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const Shop = require(path.join(process.cwd(), "src/modules/shop/shop.model"));
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
        allowNull: true,
        type: DataTypes.UUID
    },
    shop_id: {
        allowNull: true,
        type: DataTypes.UUID
    },
    rating: {
        type: DataTypes.INTEGER
    },
    description: {
        type: DataTypes.STRING(500)
    }
},
 {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Review.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });
Review.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });

module.exports = Review;