const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const Role = require(path.join(process.cwd(), 'src/modules/platform/role/role.model'));

const { DataTypes } = require('sequelize');

const RolePermission = sequelize.define('role_permissions', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    permission_id: {
        type: DataTypes.UUID
    },
    role_id: {
        type: DataTypes.UUID
    },
}, {
    tableName: 'role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

RolePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
Role.hasMany(RolePermission, { as: "role_permissions", foreignKey: "role_id" });

module.exports = RolePermission;