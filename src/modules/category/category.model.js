const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
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
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'category_id' });
<<<<<<< HEAD
Category.belongsTo(Shop, { as: 'shops', foreignKey: 'shop_id' });
=======
SubCategory.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });
>>>>>>> master

module.exports = Category;