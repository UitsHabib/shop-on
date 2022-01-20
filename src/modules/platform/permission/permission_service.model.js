const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));

const { DataTypes } = require('sequelize');

const PermissionService = sequelize.define('permission_service', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    service_id: {        //FK of service table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'permission_service',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Permission.hasMany(PermissionService, { as: "permission_services", foreignKey: "permission_id" });

PermissionService.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });

module.exports = PermissionService;