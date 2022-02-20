const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const SubCategory = require('./sub-category.model');

const Category = sequelize.define('categories', {
    category: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { as: 'category', foreignKey: 'category_id' });

module.exports = Category;