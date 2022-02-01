const path = require('path');
const controller = require("./permission.controller");
const {AuthStrategy} = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const {ServiceGuard} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.mddlewares"));
const {Services} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));


module.exports = (app) => {
    app.route('/api/permissions')
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.getPermissions)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.createPermissions)

    app.route("/api/permissions/:id")
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.getPermission)
        .put(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.updatePermission)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_PERMISSION]), controller.deletePermission);
}
