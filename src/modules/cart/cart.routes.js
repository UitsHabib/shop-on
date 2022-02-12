const path = require("path");
const controller = require("./cart.controller");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate"
));

module.exports = (app) => {
  app
    .route("/api/Cart")
    .post(controller.addToCart);

  app
    .route("/api/cart/:id")
    .get(controller.getAllCart)
    .patch(controller.patchProduct)
    .delete(controller.deleteProduct);
};