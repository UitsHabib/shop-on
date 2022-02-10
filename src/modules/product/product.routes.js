const path = require("path");
const controller = require("./product.controller");
<<<<<<< HEAD
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { productUploadSchema, productUpdateSchema, } = require("./product.schema");
=======
const multer = require('../../modules/product/product.multer');
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate"
));
const {
  productUploadSchema,
  productUpdateSchema,
} = require("./product.schema");
>>>>>>> 24a221209c8e1011643ce6247725df47e2506a85

module.exports = (app) => {
  app
    .route("/api/products")
    .get(controller.getProducts)
    .post(validate(productUploadSchema), controller.addProduct);

  app
    .route("/api/products/:id")
    .get(controller.getProduct)
    .put(validate(productUploadSchema), controller.putProduct)
    .patch(validate(productUpdateSchema), controller.patchProduct)
    .delete(controller.deleteProduct);
};
