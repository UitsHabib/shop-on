const bcrypt = require("bcrypt");
const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");
const UserProfile = require("./user-profile.model");
const User = sequelize.define("users", {
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: true
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
        set(value) {
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
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

User.belongsTo(UserProfile, { as: 'user-profile', foreignKey: 'profile_id' });
UserProfile.hasMany(User, { as: 'users', foreignKey: 'profile_id' });

module.exports = User;
