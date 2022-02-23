const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const ProfilePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/profile-permission.model'));
const { DataTypes } = require('sequelize');

const Profile = sequelize.define('profiles', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
        type: DataTypes.STRING(50)
    },
    slug: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM,
        values: ['custom', 'standard'],
        defaultValue: 'custom'
    },
    description: {
        type: DataTypes.STRING(500)
    },
    created_by: {
        type: DataTypes.UUID
    },
    updated_by: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Profile.hasMany(ProfilePermission, { as: "profile_permissions", foreignKey: "profile_id" });

module.exports = Profile;