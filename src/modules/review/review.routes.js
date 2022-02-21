const path = require("path");
const { AuthStrategy } = require("../platform/user/user-authentication.middleware");
const controller = require("./review.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const {reviewSchema} = require("./review.schema");

module.exports = (app) => {
   
    app.route("/api/reviews/products")
        .get(controller.getReviews)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewSchema), controller.createReview);
        
    app.route("/api/reviews/products/:id")
        .get(controller.getReview)
        .patch(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewUpdateSchema), controller.updateReview)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), controller.deleteReview);  
        
    app.route("/api/reviews/shops")
        .get(controller.getReviews)
        .post(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewSchema), controller.createReview)  
        
    app.route("/api/reviews/shops/:id")
        .get(controller.getReview)
        .patch(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), validate(reviewUpdateSchema), controller.updateReview)
        .delete(AuthStrategy, ServiceGuard([Services.MANAGE_REVIEW]), controller.deleteReview);                
};
