const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const { DataTypes } = require('sequelize');

const ProfilePermission = sequelize.define('profile_permissions', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    profile_id: {     //FK of profile table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'profile_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Permission.hasMany(ProfilePermission, { as: "profile_permissions", foreignKey: "permission_id" });
ProfilePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });

module.exports = ProfilePermission;