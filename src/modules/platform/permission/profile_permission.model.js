const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const { DataTypes } = require('sequelize');

const ProfilePermission = sequelize.define('profile_permission', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    profile_id: {     //FK of profile table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'profile_permission',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

ProfilePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
Permission.hasMany(ProfilePermission, { as: "profile_permissions", foreignKey: "permission_id" });

module.exports = ProfilePermission;