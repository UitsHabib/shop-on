const path = require("path");
const { AuthStrategy } = require("../customer/customer-authentication.middleware");
const controller = require("./review.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const {reviewSchema} = require("./review.schema");

module.exports = (app) => {
    app.route("/api/reviews/products")
        .get(controller.getProductReviews)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewSchema), controller.createProductReview);
        
    app.route("/api/reviews/products/:id")
        .get(controller.getProductReview)
        .patch(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewUpdateSchema), controller.updateProductReview)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), controller.deleteReview);  
        
    app.route("/api/reviews/shops")
        .get(controller.getShopReviews)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewSchema), controller.createShopReview);  
        
    app.route("/api/reviews/shops/:id")
        .get(controller.getShopReview)
        .patch(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewUpdateSchema), controller.updateShopReview)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), controller.deleteShopReview);                
};
