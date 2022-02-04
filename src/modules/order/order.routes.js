const path = require("path");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const ordersController = require("./order.controller");

module.exports = (app) => {
  app
    .route("/api/orders")
    .get(ordersController.getOrders)
    .post(ordersController.getOrderByUser)
    .post(ordersController.createOrder)
    .post(ordersController.updateOrder);
};
