const Review = require("./review.model");

async function getReviews(req, res) {
    try {
        const reviews = await Review.findAll({  });

        res.status(200).send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getReview(req, res) {
    try {
        const { id } = req.params;

        const review = await review.findOne({
            where: {
                id,
            },
        });

        if (!review) return res.status(404).send("review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function createReview(req, res) {
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

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_id, customer_id, rating, description, } = req.body;
        const product_id = req.product.id;

        const user = await User.findOne({
            where: {
                id,
            },
        });

        if (!user) return res.status(404).send("User not found!");

        if (rating) user.update({ rating, updated_by: customer_id });
        if (description) user.update({ description, updated_by: customer_id });

        if (product_id) {
            const profile = await review.findOne({
                where: {
                    id: product_id,
                },
            });

            if (!review) return res.status(400).send("Bad Request!");

            user.update({ product_id, updated_by: customer_id });
        }

        if (role_id) {
            const role = await Role.findOne({
                where: {
                    id: role_id,
                },
            });

            if (!role) return res.status(400).send("Bad Request!");

            user.update({ role_id, updated_by: userId });
        }

        {
            const { password, password_updated_at, ...userInfo } = user.dataValues;
            res.status(201).send(userInfo);
        }

    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: {
                id,
            },
        });

        if (!user) return res.status(404).send("User not found!");

        await user.destroy();

        {
            const { product_id, customer_id, rating, description, } = user.dataValues;
            res.status(201).send(userInfo);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getrReviews = getReviews;
module.exports.getReview = getReview;
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
