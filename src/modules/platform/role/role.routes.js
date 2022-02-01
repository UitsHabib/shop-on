const path = require('path');
const controller = require('./role.controller');
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const { Services } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));
const { ServiceGuard } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const { roleCreateSchema, roleUpdateSchema } = require('./profile.schema');
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/roles')
        .get(controller.getRoles)
        .post(controller.createRole);

    app.route('/api/roles/:id')
        .get(controller.getRole)
        .patch(controller.updateRole)
        .delete(controller.deleteRole);
}