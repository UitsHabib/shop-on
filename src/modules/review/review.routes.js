const path = require("path");
const { AuthStrategy: CustomerAuthStrategy } = require(path.join(process.cwd(), "src/modules/customer/customer-authentication.middleware"));
const controller = require(path.join(process.cwd(), "src/modules/review/review.controller"));
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { reviewSchema } = require(path.join(process.cwd(), "src/modules/review/review.schema"));

module.exports = (app) => {
    app.route('/api/reviews/products/:id')
        .post(CustomerAuthStrategy, validate(reviewSchema), controller.reviewProduct);

    app.route('/api/reviews/shops/:id')
        .post(CustomerAuthStrategy, controller.reviewShop);
        
    app.route('/api/reviews/:id/product')
        .get(controller.getProductReview)
        .patch(CustomerAuthStrategy, controller.updateProductReview)
        .delete(CustomerAuthStrategy, controller.deleteProductReview);

    app.route('/api/reviews/:id/shop')
        .get(controller.getShopReview)
        .patch(CustomerAuthStrategy, controller.updateShopReview)
        .delete(CustomerAuthStrategy, controller.deleteShopReview);
};
