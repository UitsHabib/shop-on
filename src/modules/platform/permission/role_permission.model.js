const path = require('path');
const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));

const { DataTypes } = require('sequelize');

const RolePermission = sequelize.define('role_permission', {
    permission_id: {  //FK of permission table
        type: DataTypes.INTEGER
    },
    role_id: {        //FK of role table
        type: DataTypes.INTEGER
    },
}, {
    tableName: 'role_permission',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Permission.hasMany(RolePermission, { as:"role_permissions", foreignKey: "permission_id" });
RolePermission.belongsTo(Permission, { as:"permission", foreignKey: "permission_id" });

module.exports = RolePermission;