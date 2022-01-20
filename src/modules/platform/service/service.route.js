const path = require("path");
const controller = require("./service.controller");

module.exports = (app) => {
app.route("/api/services")
    .get(controller.getServices)
    .post(controller.addService);

app.route("/api/services/:id")
    .get(controller.getService)
    .put(controller.putService)
    .patch(controller.patchService)
    .delete(controller.deleteService);
}
