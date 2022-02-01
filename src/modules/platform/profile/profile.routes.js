const path = require('path');
const controller = require('./profile.controller');
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const { profileCreateSchema, profileUpdateSchema } = require('./profile.schema');
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/profiles')
        .get(AuthStrategy, controller.getProfiles)
        .post(AuthStrategy, validate(profileCreateSchema), controller.createProfile);

    app.route('/api/profiles/:id')
        .get(AuthStrategy, controller.getProfile)
        // .put(validate(profileCreateSchema), controller.updateProfile)
        .patch(AuthStrategy, validate(profileUpdateSchema), controller.updateProfilePartial)
        .delete(AuthStrategy, controller.deleteProfile);
}