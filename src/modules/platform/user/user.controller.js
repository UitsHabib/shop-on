const path = require("path");
const User = require("./user.model");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
const { generateAccessToken } = require("./service/user.service");

const userAttributes = [
    "id",
    "profile_id",
    "first_name",
    "last_name",
    "email",
    "phone",
    "status",
    "last_login",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "role_id"
]

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

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: userAttributes,
            include: [
                {
                    model: Profile,
                    as: "profile",
                },
            ],
        });

        res.status(200).send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: {
                id,
            },
            attributes: userAttributes,
            include: [
                {
                    model: Profile,
                    as: "profile",
                },
            ],
        });

        if (!user) return res.status(404).send("User not found!");

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const createUser = async (req, res) => {
    try {
        const loggedUser = req.user;
        const { first_name, last_name, email, password, profile_id, role_id } = req.body;

        const existUser = await User.findOne({
            where: {
                email,
            },
        });

        if (existUser)
            return res
                .status(400)
                .send("Already registered with this email address.");

        const profile = await Profile.findOne({
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

        const user = await User.create({
            first_name,
            last_name,
            email,
            password,
            profile_id: profile_id,
            role_id: role?.id || null,
            created_by: loggedUser.id,
            updated_by: loggedUser.id,
        });


        const { password: Password, ...restUserInfo } = user.dataValues;
        res.status(201).send(restUserInfo);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, profile_id, role_id } = req.body;
        const userId = req.user.id;

        const user = await User.findOne({
            where: {
                id,
            },
        });

        if (!user) return res.status(404).send("User not found!");

        if (first_name) user.update({ first_name, updated_by: userId });
        if (last_name) user.update({ last_name, updated_by: userId });
        if (email) {
            const existingUser = await User.findOne({
                where: {
                    email: email,
                }
            });
            if (existingUser) return res.status(400).send("Already registered with this email address.");

            user.update({ email, updated_by: userId });
        }

        if (profile_id) {
            const profile = await Profile.findOne({
                where: {
                    id: profile_id,
                },
            });

            if (!profile) return res.status(400).send("Bad Request!");

            user.update({ profile_id, updated_by: userId });
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

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteUser = async (req, res) => {
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
            const { password, password_updated_at, ...userInfo } = user.dataValues;
            res.status(201).send(userInfo);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.login = login;
module.exports.logout = logout;
module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
