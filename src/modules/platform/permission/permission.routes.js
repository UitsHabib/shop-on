const path = require('path');
const controller = require("./permission.controller")


module.exports = (app) => {
    app.route('/api/permissions')
        .get(controller.getPermissions)
        .post(controller.createPermissions)

    app.route("/api/permissions/:id")
        .get(controller.getPermission)
        .put(controller.updatePermission)
        .delete(controller.deletePermission);
}
