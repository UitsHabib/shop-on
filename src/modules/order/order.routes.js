const path = require("path");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const controller = require(path.join(process.cwd(), "src/modules/order/order.controller"));

module.exports = (app) => {
    app.route("/api/orders")
        //.get(controller.getOrders)
        .post(controller.createOrder).

    app.route("/api/orders/:id")
        .get(controller.getOrder)
        .delete(controller.deleteOrder);  
    
    app.route("/api/shops/:id/orders")
        .get(controller.getOrders);

    app.route("/api/shops/:id/orders/:id")
        .get(controller.getOrder)
        .put(controller.updateOrder)
        .delete(controller.deleteOrder); 
};  