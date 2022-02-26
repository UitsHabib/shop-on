const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const { DataTypes } = require("sequelize");

const ProductReview = sequelize.define("product_reviews", {
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
    product_id: {
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
    tableName: 'product_reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

ProductReview.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

module.exports = ProductReview;