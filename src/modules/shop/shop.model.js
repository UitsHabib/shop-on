const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));

const Shop = sequelize.define('shops', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(255),
    },
    description: {
        allowNull: true,
        type: DataTypes.STRING(2048)
    },
    email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING(255),
        validate: {
            isEmail: true
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING(1024),
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    license_number: {
        allowNull: false,
        type: DataTypes.STRING(255),
    },
    is_active: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        defaultValue: '1'
    },
    profile_image: {
        allowNull: true,
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