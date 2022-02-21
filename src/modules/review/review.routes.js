const path = require("path");
const controller = require("./review.controller");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const {reviewSchema} = require("./review.schema");

module.exports = (app) => {
   
    app.route('/api/reviews')
        .get(controller.getreviews)
        .post(validate(reviewSchema), controller.createreview);

    app.route('/api/reviews/:id')
        .get(controller.getreview)
};
