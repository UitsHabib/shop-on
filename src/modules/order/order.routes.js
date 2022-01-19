const path = require("path");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const ordersController = require("./order.controller");

module.exports = (app) => {
  app
    .route("/get-all-orders")
    .get(ordersController.getAllOrders);
  app
    .route("/order-by-user")
    .post(ordersController.getOrderByUser);

  app
    .route("/create-order")
    .post(ordersController.postCreateOrder);
  app
    .route("/update-order")
    .post(ordersController.postUpdateOrder);
  app
    .route("/delete-order")
    .post(ordersController.postDeleteOrder);
};
