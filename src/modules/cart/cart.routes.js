const path = require("path");
const controller = require("./cart.controller");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate"
));

module.exports = (app) => {
  app
    .route("/api/carts/users/:userId")
    .post(controller.addToCart);

  app
    .route("/api/cart/:id/users/:userId")
    .get(controller.getCartByUser)

};