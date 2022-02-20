const bcrypt = require("bcrypt");
const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");
const Customer = sequelize.define("customers", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    first_name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(100),
        validate: {
            isEmail: true
        },
        set(value){
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8));
        }
    },
    phone: {
        type: DataTypes.STRING(25)
    },
    avatar_url: {
        allowNull: true,
        type: DataTypes.STRING(255)
    },
    status: {
        type: DataTypes.ENUM,
        values: ['active', 'inactive'],
        defaultValue: 'active'
    },
    last_login: {
        type: DataTypes.DATE
    },
    password_updated_at: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Customer.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = Customer;
