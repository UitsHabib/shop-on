const path = require("path");
const controller = require("./product.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

const {
    productUploadSchema,
    productUpdateSchema,
} = require("./product.schema");

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
