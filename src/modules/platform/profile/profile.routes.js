const path = require('path');
const controller = require('./profile.controller');
const { profileCreateSchema, profileUpdateSchema } = require('./profile.schema');
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/profiles')
        .get(controller.getProfiles)
        .post(validate(profileCreateSchema), controller.createProfile);

    app.route('/api/profiles/:id')
        .get(controller.getProfile)
        .put(validate(profileCreateSchema), controller.updateProfile)
        .patch(validate(profileUpdateSchema), controller.updateProfilePartial)
        .delete(controller.deleteProfile);
}