const path = require('path');
const controller = require('./role.controller');
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const { Services } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));
const { ServiceGuard } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const { roleCreateSchema, roleUpdateSchema } = require('./role.schema');
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/roles')
        .get(AuthStrategy, controller.getRoles)
        .post(AuthStrategy, validate(roleCreateSchema), controller.createRole);

    app.route('/api/roles/:id')
        .get(AuthStrategy, controller.getRole)
        .patch(AuthStrategy, validate(roleUpdateSchema), controller.updateRole)
        .delete(AuthStrategy, controller.deleteRole);
}