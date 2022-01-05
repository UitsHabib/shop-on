const path = require("path");
const controller = require("./user.controller");
const { AuthStrategy } = require("./user-authentication.middleware");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { userRegisterSchema, userUpdateSchema } = require("./user.schema");

module.exports = (app) => {
    app.post('/api/login', controller.login);

    app.get('/api/logout', AuthStrategy, controller.logout);

    app.route('/api/users')
        .post(validate(userRegisterSchema), controller.createUser);

    // app.route('/api/users/profile')
    //     .get(AuthStrategy, controller.getSignedInUserProfile)
    //     .put(AuthStrategy, controller.updateSignedInUserProfile);

    app.route('/api/users/:id')
        .get(AuthStrategy, controller.getUser)
        .put(AuthStrategy, validate(userUpdateSchema), controller.updateUser)
        .patch(AuthStrategy, validate(userUpdateSchema), controller.updateUserDetails)
        .delete(AuthStrategy, controller.deleteUser);
};
