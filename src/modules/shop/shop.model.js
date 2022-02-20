const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));

const Shop = sequelize.define('shops', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(255),
        validate: {
            isEmail: true
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    description: {
        type: DataTypes.STRING(2048)
    },
    license_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_active: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        defaultValue: '1'
    },
    shop_profile_image: {
        type: DataTypes.STRING(1024)
    }
}, {
    tableName: 'shops',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Shop.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Shop.hasMany(Product, { as: 'products', foreignKey: 'shop_id' });
Product.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id' });

module.exports = Shop;