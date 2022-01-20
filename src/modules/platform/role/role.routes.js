const controller = require('./role.controller');

module.exports = (app) => {
    app.route('/api/roles')
        .get(controller.getRoles)
        .post(controller.createRole);

    app.route('/api/roles/:id')
        .get(controller.getRole)
        .put(controller.updateRole)
        .delete(controller.deleteRole);
}