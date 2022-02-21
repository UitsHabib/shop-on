const path = require("path");
const Review = require("../../review/review.model");
const review = require("./review.model");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
<<<<<<< HEAD

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
=======
const ProfilePermission = require(path.join(process.cwd(), "src/modules/platform/permission/profile-permission.model"));
const RolePermission = require(path.join(process.cwd(), "src/modules/platform/permission/role-permission.model"));
const Permission = require(path.join(process.cwd(), "src/modules/platform/permission/permission.model"));
const PermissionService = require(path.join(process.cwd(), "src/modules/platform/permission/permission-service.model"));
const Service = require(path.join(process.cwd(), "src/modules/platform/service/service.model"));
const { generateAccessToken } = require("./service/user.service");

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user || !user.password || !user.validPassword(password))
            return res.status(400).send("Invalid email or password!");

        res.cookie("access_token", generateAccessToken(user), { httpOnly: true, sameSite: true, signed: true });

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal server error!");
    }
};

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").redirect("/");
}

async function getSignedInUserProfile (req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
            include: [
                {
                    model: Profile,
                    as: "profile",
                    include: [
                        {
                            model: ProfilePermission,
                            as: 'profile_permissions',
                            include: [
                                {
                                    model: Permission,
                                    as: 'permission',
                                    include: [
                                        {
                                            model: PermissionService,
                                            as: 'permission_services',
                                            include: [
                                                {
                                                    model: Service,
                                                    as: 'service'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Role,
                    as: 'role',
                    include: [
                        {
                            model: RolePermission,
                            as: 'role_permissions',
                            include: [
                                {
                                    model: Permission,
                                    as: 'permission',
                                    include: [
                                        {
                                            model: PermissionService,
                                            as: 'permission_services',
                                            include: [
                                                {
                                                    model: Service,
                                                    as: 'service'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
        });

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
}

async function updateSignedInUserProfile (req, res) {
    try {
        const { first_name, last_name, password, phone, profile_id, role_id } = req.body;

        const user = await User.findOne({ where: { id: req.user.id }});

        if (!user) return res.status(404).send("User not found!");

        if (first_name) await user.update({ first_name });

        if (last_name) user.update({ last_name });

        if (password) user.update({ password });

        if (phone) user.update({ phone });

        if (profile_id) {
            const profile = await Profile.findOne({ where: { id: profile_id }});
            if (profile) await user.update({ profile_id });
        }

        if (role_id) {
            const role = await Role.findOne({ where: { id: role_id }});
            if (!role) await user.update({ role_id });
        }

        await user.update({ updated_by: req.user.id });
        
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: userAttributes,
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
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

<<<<<<< HEAD
const getReview = async (req, res) => {
=======
async function getUser(req, res) {
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
    try {
        const { id } = req.params;

        const review = await review.findOne({
            where: {
                id,
            },
<<<<<<< HEAD
            attributes: reviewAttributes,
=======
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
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

<<<<<<< HEAD
const createReview = async (req, res) => {
=======
async function createUser(req, res) {
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
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

<<<<<<< HEAD
const updateReview = async (req, res) => {
=======
async function updateUser(req, res) {
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
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

<<<<<<< HEAD
const deleteReview = async (req, res) => {
=======
async function deleteUser(req, res) {
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
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

<<<<<<< HEAD
module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
module.exports.createReview = createReview;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
=======
module.exports.login = login;
module.exports.logout = logout;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
module.exports.getSignedInUserProfile = getSignedInUserProfile;
module.exports.updateSignedInUserProfile = updateSignedInUserProfile;
>>>>>>> 0851164d77aa885dee75f3b0265c82eb7fefe427
