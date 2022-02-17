const path = require("path");
const controller = require("./service.controller");
const {AuthStrategy} = require(path.join(process.cwd(), "src/modules/platform/user/user-authentication.middleware"));
const {ServiceGuard} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middlewares"));
const {Services} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants"));

module.exports = (app) => {
    app.route("/api/services")
        .get(AuthStrategy, ServiceGuard([Services.PLATFORM]), controller.getServices);
}

