const path = require("path");
const { AuthStrategy } = require("../shop/shop-authentication.middleware");
const controller = require("./product.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { productUploadSchema, productUpdateSchema } = require("./product.schema");

module.exports = (app) => {
    app.route("/api/products")
        .get(controller.getProducts);

    app.route("/api/products/:id")
        .get(controller.getProduct);

    app.route("/api/shops/:id/categories")
        .get(controller.getCategories)
        .post(validate(productUploadSchema), controller.addCategory);

    // app.route("/api/shops/:id/category/:id")
    //     .patch(controller.updateCategory)
    //     .delete(validate(productUploadSchema), controller.deleteCategory);
};
