const path = require('path');
const controller = require('./profile.controller');
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const { Services } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));
const { ServiceGuard } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const { profileCreateSchema, profileUpdateSchema } = require('./profile.schema');
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/profiles')
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PROFILE]), controller.getProfiles)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_PROFILE]), validate(profileCreateSchema), controller.createProfile);

    app.route('/api/profiles/:id')
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_PROFILE]), controller.getProfile)
        .patch(AuthStrategy, ServiceGuard([Services.MANAGE_PROFILE]), validate(profileUpdateSchema), controller.updateProfile)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_PROFILE]), controller.deleteProfile);
}