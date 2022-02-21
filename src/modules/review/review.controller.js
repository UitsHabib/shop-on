const Review = require("./review.model");
const {Op } = require("sequelize");

async function getProductReviews(req, res) {
    try {
        const reviews = await Review.findAll({ 
            where: {
                product_id: {[Op.ne]: null}
            }
         });

        res.status(200).send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getProductReview(req, res) {
    try {
        const { id } = req.params;

        const review = await Review.findOne({
            where: {
                product_id: id,
            },
        });

        if (!review) return res.status(404).send("review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getShopReviews(req, res) {
    try {
        const reviews = await Review.findAll({  });

        res.status(200).send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getShopReview(req, res) {
    try {
        const { id } = req.params;

        const review = await Review.findOne({
            where: {
                shop_id: id,
            },
        });

        if (!review) return res.status(404).send("review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function createProductReview(req, res) {
    try {
        const { customer_id, product_id, rating, description } = req.body;

        const review = await Review.create({
            product_id,
            customer_id,
            rating,
            description,
        });

        res.status(201).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};


async function createShopReview(req, res) {
    try {
        const { customer_id, shop_id, rating, description } = req.body;

        const review = await Review.create({
            customer_id,
            shop_id,
            rating,
            description,
        });

        res.status(201).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateProductReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, customer_id, rating, description, } = req.body;
        const product_id = req.product.id;

        const Review = await Review.findOne({
            where: {
                product_id: id,
            },
        });

        if (!Review) return res.status(404).send("Review not found!");

        if (rating) Review.update({ rating, updated_by: customer_id });
        if (description) Review.update({ description, updated_by: customer_id });

        if (product_id) {
            const profile = await review.findOne({
                where: {
                    id: product_id,
                },
            });

            if (!review) return res.status(400).send("Bad Request!");

            Review.update({ product_id, updated_by: customer_id });
        }

        if (role_id) {
            const role = await Role.findOne({
                where: {
                    id,
                },
            });

            if (!role) return res.status(400).send("Bad Request!");

            Review.update({ role_id, updated_by: ReviewId });
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateShopReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { shop_id, customer_id, rating, description, } = req.body;
        const shop_id = req.product.id;

        const Review = await Review.findOne({
            where: {
                id,
            },
        });

        if (!Review) return res.status(404).send("Review not found!");

        if (rating) Review.update({ rating, updated_by: customer_id });
        if (description) Review.update({ description, updated_by: customer_id });

        if (shop_id) {
            const review = await review.findOne({
                where: {
                    id: shop_id,
                },
            });

            if (!review) return res.status(400).send("Bad Request!");

            Review.update({ shop_id, updated_by: customer_id });
        }

        if (role_id) {
            const role = await Role.findOne({
                where: {
                    id: role_id,
                },
            });

            if (!role) return res.status(400).send("Bad Request!");

            Review.update({ role_id, updated_by: ReviewId });
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteProductReview = async (req, res) => {
    try {
        const { id } = req.params;

        const Review = await Review.findOne({
            where: {
                id,
            },
        });

        if (!product) return res.status(404).send("Product not found!");

        await product.destroy();
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteShopReview = async (req, res) => {
    try {
        const { id } = req.params;

        const Review = await Review.findOne({
            where: {
                id,
            },
        });

        if (!Review) return res.status(404).send("Review not found!");

        await Review.destroy();
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getProductReviews = getProductReviews;
module.exports.getProductReview = getProductReview;
module.exports.createProductReview = createProductReview;
module.exports.updateProductReview = updateProductReview;
module.exports.deleteProductReview = deleteProductReview;
module.exports.getShopReviews = getShopReviews;
module.exports.getShopReview = getShopReview;
module.exports.createShopReview = createShopReview;
module.exports.updateShopReview = updateShopReview;
module.exports.deleteShopReview = deleteShopReview;