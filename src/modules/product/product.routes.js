const path = require("path");
const multer = require("../../config/lib/multer");
const { AuthStrategy } = require("../shop/shop-authentication.middleware");
const controller = require("./product.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { productUploadSchema, productUpdateSchema, validateFile } = require("./product.schema");

module.exports = (app) => {
  app.route("/api/products")
    .get(controller.getProducts)
    .post(AuthStrategy, validate(productUploadSchema), controller.addProduct);

  app.route("/api/products/:id")
    .get(controller.getProduct)
    .put(AuthStrategy, validateFile(multer.single('product_profile_image')), validate(productUploadSchema), controller.updateProduct)
    .patch(AuthStrategy, validateFile(multer.single('product_profile_image')), validate(productUpdateSchema), controller.updateProductInfo)
    .delete(AuthStrategy, controller.deleteProduct);
};
