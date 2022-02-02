const path = require("path");
const User = require("./user.model");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
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

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
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
            }, include: [
                {
                    model: UserProfile,
                    as: "user_profile",
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
        const { username, email, password, profile_id } = req.body;
        const admin = await User.findOne({
            where: {
                id: req.user.id,
            }
        });

        if (admin.email != "habiburrahman3089@gmail.com") {
            return res.status(403).send("You are not authorized to create an user.")
        }

        const existUser = await User.findOne({
            where: {
                email,
            },
        });

        if (existUser)
            return res
                .status(400)
                .send("Already registered with this email address.");

        const user = await User.create({
            username,
            email,
            password,
            profile_id: profile_id,
        });

        res.status(201).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, username, email } = req.body;

        const user = await User.update(
            {
                first_name: firstName,
                last_name: lastName,
                username,
                email,
            },
            {
                where: {
                    id,
                },
            }
        );

        if (!user) return res.status(404).send("User not found!");

        res.status(201).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, username, email, profile_id, role_id } = req.body;

        const user = await User.findOne({
            where: {
                id,
            },
        });

        if (!user) return res.status(404).send("User not found!");

        if (firstName) user.update({ first_name: firstName });
        if (lastName) user.update({ first_name: lastName });
        if (username) user.update({ username });
        if (email) user.update({ email });
        if (profile_id){
            const profile = await Profile.findOne({
                where: {
                    id: profile_id,
                },
            });  

            if (!profile) return res.status(400).send("Bad Request!");

            user.update({ profile_id });
        }
         
        if (role_id){
            const role = await Role.findOne({
                where: {
                    id: role_id,
                },
            }); 

            if (!role) return res.status(400).send("Bad Request!");

            user.update({ role_id });
        }
        res.status(201).send(user);
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

        res.sendStatus(200).send(user);
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
module.exports.updateUserDetails = updateUserDetails;
module.exports.deleteUser = deleteUser;
