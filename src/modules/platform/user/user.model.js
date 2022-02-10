const bcrypt = require("bcrypt");
const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
const User = sequelize.define("users", {
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    first_name: {
        allowNull: true,
        type: DataTypes.STRING(50)
    },
    last_name: {
        allowNull: true,
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
        allowNull: false,
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
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
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

Profile.hasMany(User, { as: 'users', foreignKey: 'profile_id' });
User.belongsTo(Profile, { as: 'profile', foreignKey: 'profile_id' });

Role.hasMany(User, { as: 'users', foreignKey: 'role_id' });
User.belongsTo(Role, { as: 'role', foreignKey: 'role_id' });

module.exports = User;