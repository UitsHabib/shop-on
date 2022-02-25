const path = require("path");
const controller = require("./category.controllers");
const { categorySchema } = require("./category.schema");
const { subCategorySchema } = require("./sub-category.schema");
const { AuthStrategy } = require(path.join(process.cwd(), "src/modules/shop/shop-authentication.middleware"));
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/categories')
        .get(controller.getCategories)
        .post(AuthStrategy, validate(categorySchema), controller.createCategory);

    app.route('/api/categories/:id')
        .get(controller.getCategory)
        .put(AuthStrategy, validate(categorySchema), controller.updateCategory)
        .delete(AuthStrategy, controller.deleteCategory);


    app.route('/api/categories/:id/subCategories')
        .get(controller.getSubCategories)
        .post(AuthStrategy, validate(subCategorySchema), controller.createSubCategory);

    app.route('/api/categories/:id/subCategories/:subCategoryId')
        .get(controller.getSubCategory)
        .put(AuthStrategy, validate(subCategorySchema), controller.updateSubCategory)
        .delete(AuthStrategy, controller.deleteSubCategory);
}