const Review = require("./review.model");

async function getreviews(req, res) {
    try {
        const reviews = await Review.findAll({  });

        res.status(200).send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getreview(req, res) {
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

async function createreview(req, res) {
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

module.exports.getreviews = getreviews;
module.exports.getreview = getreview;
module.exports.createreview = createreview;
