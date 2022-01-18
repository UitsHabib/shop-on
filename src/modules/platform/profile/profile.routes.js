const controller = require('./profile.controller');

module.exports = (app) => {
    app.route('/api/profiles')
        .get(controller.getProfiles)
        .post();

    app.route('/api/profiles/:id')
        .get()
        .put()
        .delete();
}