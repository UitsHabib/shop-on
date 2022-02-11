const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const Category = require('./category.model');

const SubCategory = sequelize.define('subCategories', {
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sub_category: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'subCategories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

SubCategory.belongsTo(Category, { as: 'categories', foreignKey: 'category_id' });

module.exports = SubCategory;