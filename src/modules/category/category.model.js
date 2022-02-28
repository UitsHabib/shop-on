const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));
const { DataTypes } = require('sequelize');
const SubCategory = require('./sub-category.model');
const Shop = require(path.join(process.cwd(), 'src/modules/shop/shop.model.js'));

const Category = sequelize.define('categories', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    shop_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

Shop.hasMany(Category, { as: 'categories', foreignKey: 'shop_id' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = Category;
