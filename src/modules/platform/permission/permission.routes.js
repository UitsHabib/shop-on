const path = require('path');
const controller = require("./permission.controller");
const {AuthStrategy} = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const {ServiceGuard} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const {Services} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const {permissionCreateSchema, permissionUpdateSchema} = require("./permission.schema");

module.exports = (app) => {
    app.route('/api/permissions')
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.getPermissions)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), validate(permissionCreateSchema), controller.createPermissions)

    app.route("/api/permissions/:id")
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.getPermission)
        .put(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]),  validate(permissionUpdateSchema), controller.updatePermission)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.deletePermission);
}
