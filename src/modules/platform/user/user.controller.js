const path = require("path");
const Review = require("../../review/review.model");
const review = require("./review.model");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                {
                    model: Review,
                    as: "review",
                },
            ],
        });

        res.status(200).send(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const getReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await review.findOne({
            where: {
                id,
            },
            attributes: reviewAttributes,
            include: [
                {
                    model: Profile,
                    as: "profile",
                },
            ],
        });

        if (!review) return res.status(404).send("Review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const createReview = async (req, res) => {
    try {
        const { first_name, last_name, email, password, profile_id, role_id } = req.body;

        const existReview = await Review.findOne({
            where: {
                email,
            },
        });

        if (existReview)
            return res
                .status(400)
                .send("Already registered with this email address.");

        const review = await Review.findOne({
            where: {
                id: profile_id,
            },
        });

        if (!profile) return res.status(400).send("Profile not found.");

        const role = role_id && await Role.findOne({
            where: {
                id: role_id,
            },
        });

        const review = await review.create({
            first_name,
            last_name,
            email,
            password,
            profile_id: profile_id,
            role_id: role?.id || null,
            created_by: loggedreview.id,
            updated_by: loggedreview.id,
        });


        const { password: Password, ...restreviewInfo } = review.dataValues;
        res.status(201).send(restreviewInfo);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, profile_id, role_id } = req.body;
        const reviewId = req.review.id;

        const review = await review.findOne({
            where: {
                id,
            },
        });

        if (!review) return res.status(404).send("review not found!");

        if (first_name) review.update({ first_name, updated_by: reviewId });
        if (last_name) review.update({ last_name, updated_by: reviewId });
        if (email) {
            const existingreview = await review.findOne({
                where: {
                    email: email,
                }
            });
            if (existingreview) return res.status(400).send("Already registered with this email address.");

            review.update({ email, updated_by: reviewId });
        }

        if (profile_id) {
            const profile = await Profile.findOne({
                where: {
                    id: profile_id,
                },
            });

            if (!profile) return res.status(400).send("Bad Request!");

            review.update({ profile_id, updated_by: reviewId });
        }

        if (role_id) {
            const role = await Role.findOne({
                where: {
                    id: role_id,
                },
            });

            if (!role) return res.status(400).send("Bad Request!");

            review.update({ role_id, updated_by: reviewId });
        }

        {
            const { password, password_updated_at, ...reviewInfo } = review.dataValues;
            res.status(201).send(reviewInfo);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await review.findOne({
            where: {
                id,
            },
        });

        if (!review) return res.status(404).send("review not found!");

        await review.destroy();

        {
            const { password, password_updated_at, ...reviewInfo } = review.dataValues;
            res.status(201).send(reviewInfo);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
