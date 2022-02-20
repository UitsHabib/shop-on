const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const Service = require(path.join(process.cwd(), 'src/modules/platform/service/service.model'));

const { DataTypes } = require('sequelize');

const PermissionService = sequelize.define('permission_services', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    service_id: {        //FK of service table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'permission_services',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Permission.hasMany(PermissionService, { as: "permission_services", foreignKey: "permission_id" });
// Permission.belongsToMany(Service, { through: PermissionService, foreignKey: "permission_id", otherKey: "service_id" });
PermissionService.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
PermissionService.belongsTo(Service, { as: "service", foreignKey: "service_id" });

module.exports = PermissionService;