const path = require("path");
const controller = require("./service.controller");
const { AuthStrategy } = require("./user-authentication.middleware");
const {Services} = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.constants")); 
const ServiceGuard = require(path.join(process.cwd(), "src/modules/core/authorization/authorization.middleware"));

module.exports = (app) => {
app.route("/api/services")
    .get(AuthStrategy, ServiceGuard([Services.MANAGE_USER]), controller.getServices);

app.route("/api/services/:id")
    .get(AuthStrategy, ServiceGuard([Services.MANAGE_USER]), controller.getService);
}
