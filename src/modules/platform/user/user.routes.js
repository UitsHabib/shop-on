const path = require("path");
const controller = require("./user.controller");
const { AuthStrategy } = require("./user-authentication.middleware");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { Services } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));
const { ServiceGuard } = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const { userRegisterSchema, userUpdateSchema } = require("./user.schema");

module.exports = (app) => {
    app.post("/api/login", controller.login);

    app.get("/api/logout", controller.logout);

    app.route("/api/users")
        .get(AuthStrategy, ServiceGuard([Services.MANAGE_USER]), controller.getUsers)
        .post(AuthStrategy, validate(userRegisterSchema), controller.createUser);

    app.route("/api/users/:id")
        .get(AuthStrategy, controller.getUser)
        .put(AuthStrategy, validate(userUpdateSchema), controller.updateUser)
        .patch(AuthStrategy, validate(userUpdateSchema), controller.updateUserDetails)
        .delete(AuthStrategy, controller.deleteUser);
};
