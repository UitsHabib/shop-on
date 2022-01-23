const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const Role = require(path.join(process.cwd(), 'src/modules/platform/role/role.model'));

const { DataTypes } = require('sequelize');

const RolePermission = sequelize.define('role_permissions', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    role_id: {        //FK of role table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Permission.hasMany(RolePermission, { as: "role_permissions", foreignKey: "permission_id" });
RolePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
Role.hasMany(RolePermission, { as: "role_permissions", foreignKey: "role_id" });

module.exports = RolePermission;