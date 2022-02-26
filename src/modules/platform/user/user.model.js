const bcrypt = require("bcrypt");
const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
const Permission = require(path.join(process.cwd(), "src/modules/platform/permission/permission.model"));
const User = sequelize.define("users", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    profile_id: {
        allowNull: true,
        type: DataTypes.UUID
    },
    role_id: {
        allowNull: true,
        type: DataTypes.UUID
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
    created_by: {
        allowNull: true,
        type: DataTypes.UUID
    },
    updated_by: {
        allowNull: true,
        type: DataTypes.UUID
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// User.belongsTo(User, { as: 'createdByUser', foreignKey: 'created_by' });
// User.belongsTo(User, { as: 'updatedByUser', foreignKey: 'created_by' });

Profile.hasMany(User, { as: 'users', foreignKey: 'profile_id', constraints: false });
User.belongsTo(Profile, { as: 'profile', foreignKey: 'profile_id', constraints: false });

// Profile.belongsTo(User, { as: "createdByUser", foreignKey: "created_by" });
// Profile.belongsTo(User, { as: "updatedByUser", foreignKey: "updated_by" });

Role.hasMany(User, { as: 'users', foreignKey: 'role_id', constraints: false });
User.belongsTo(Role, { as: 'role', foreignKey: 'role_id', constraints: false });

// Role.belongsTo(User, { as: "createdByUser", foreignKey: "created_by" });
// Role.belongsTo(User, { as: "updatedByUser", foreignKey: "updated_by" });

// Permission.belongsTo(User, { as: 'createdByUser', foreignKey: 'created_by' });
// Permission.belongsTo(User, { as: 'updatedByUser', foreignKey: 'created_by' });

module.exports = User;