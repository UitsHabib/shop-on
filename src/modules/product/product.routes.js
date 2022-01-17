const path = require("path");
const { AuthStrategy } = require("../shop/shop-authentication.middleware");
const controller = require("./product.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { productUploadSchema, productUpdateSchema } = require("./product.schema");

module.exports = (app) => {
<<<<<<< HEAD
  app.route("/api/products")
    .get(controller.getProducts)
    .post(AuthStrategy, validate(productUploadSchema), controller.addProduct);

  app.route("/api/products/:id")
    .get(controller.getProduct)
    .put(AuthStrategy, validate(productUploadSchema), controller.updateProduct)
    .patch(AuthStrategy, validate(productUpdateSchema), controller.updateProductInfo)
    .delete(AuthStrategy, controller.deleteProduct);
};
=======
    app.route("/api/products")
        .get(controller.getProducts)
        .post(AuthStrategy, validate(productUploadSchema), controller.addProduct);

    app.route("/api/products/:id")
        .get(controller.getProduct)
        .put(AuthStrategy, validate(productUploadSchema), controller.updateProduct)
        .patch(AuthStrategy, validate(productUpdateSchema), controller.updateProductInfo)
        .delete(AuthStrategy, controller.deleteProduct);
};
>>>>>>> a379c998cc9e9ac027a23347de4d8b51921bb714
