const path = require("path");
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");

const Shop = sequelize.define('shops', {
    shop_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    registration_number: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Shop.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Shop