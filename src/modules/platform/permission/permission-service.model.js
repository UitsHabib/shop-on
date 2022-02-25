const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const Service = require(path.join(process.cwd(), 'src/modules/platform/service/service.model'));

const { DataTypes } = require('sequelize');

const PermissionService = sequelize.define('permission_services', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    permission_id: {
        type: DataTypes.UUID
    },
    service_id: {
        type: DataTypes.UUID
    },
}, {
    tableName: 'permission_services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Permission.hasMany(PermissionService, { as: "permission_services", foreignKey: "permission_id" });
PermissionService.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
PermissionService.belongsTo(Service, { as: "service", foreignKey: "service_id" });

module.exports = PermissionService;