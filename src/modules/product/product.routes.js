const path = require("path");
const controller = require("./product.controller");
const multer = require(path.join(process.cwd(), "src/config/lib/multer"));
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { productUploadSchema, productUpdateSchema, validateFile } = require("./product.schema");

module.exports = (app) => {
    app
        .route("/api/products")
        .get(controller.getProducts);

    app
        .route("/api/products/:id")
        .get(controller.getProduct);

    app
        .route("/api/shops/:id/products/:id")
        .get(controller.getProduct)
        .patch(validateFile(multer.single('product_image')), validate(productUpdateSchema), controller.updateProduct)
        .delete(controller.deleteProduct);

    app
        .route("/api/shops/:id/products/")
        .get(controller.getProducts)
        .post(validateFile(multer.single('product_image')), validate(productUploadSchema), controller.addProduct);
};
