const controller = require('./profile.controller');

module.exports = (app) => {
    app.route('/api/profiles')
        .get(controller.getProfiles)
        .post(controller.createProfile);

    app.route('/api/profiles/:id')
        .get(controller.getProfile)
        .put(controller.updateProfile)
        .delete(controller.deleteProfile);
}