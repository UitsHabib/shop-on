const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");

const Shop = sequelize.define('shops', {
    shop_name: {
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
        type: DataTypes.STRING(2000)
    },
    license_number: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
<<<<<<< HEAD
    is_active: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        defaultValue: '1'
    },
    shop_profile_image: {
        type: DataTypes.STRING
=======
    license_number: {
        type: DataTypes.STRING,
        allowNull: false
>>>>>>> a379c998cc9e9ac027a23347de4d8b51921bb714
    }
}, {
    tableName: 'shops',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
<<<<<<< HEAD
})
=======
});
>>>>>>> a379c998cc9e9ac027a23347de4d8b51921bb714

Shop.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Shop;