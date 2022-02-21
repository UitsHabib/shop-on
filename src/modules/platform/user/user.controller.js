const path = require("path");
const User = require("./user.model");
const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
const ProfilePermission = require(path.join(process.cwd(), "src/modules/platform/permission/profile-permission.model"));
const RolePermission = require(path.join(process.cwd(), "src/modules/platform/permission/role-permission.model"));
const Permission = require(path.join(process.cwd(), "src/modules/platform/permission/permission.model"));
const PermissionService = require(path.join(process.cwd(), "src/modules/platform/permission/permission-service.model"));
const Service = require(path.join(process.cwd(), "src/modules/platform/service/service.model"));
const { generateAccessToken } = require("./service/user.service");
const { Op } = require("sequelize");

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
    res.send("Logged out.");
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
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(404).send("page must be greater or equal 1");

        const limit = req.query.limit ? +req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy ? req.query.orderBy : null;
        const orderType = req.query.orderType === "asc" || req.query.orderType === "desc" ? req.query.orderType : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        const sortableColumns = [
            "first_name",
            "last_name",
            "email",
            "status",
            "created_at"
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        if (orderBy === "created_by") {
            order.splice(0, 0, [
                { model: User, as: "createdByUser" },
                "first_name",
                orderType
            ]);
            order.splice(1, 0, [
                { model: User, as: "createdByUser" },
                "last_name",
                orderType
            ]);
        }

        const filterOptions = { id: { [Op.ne]: req.user.id } };

        const { count: countByUser, rows: users } = await User.findAndCountAll({
            where: filterOptions,
            offset,
            limit,
            order,
            include: [
                {
                    model: Profile,
                    as: "profile",
                },
                {
                    model: Role,
                    as: "role",
                },
            ],
        });

        const totalUser = countByUser.length;

        const data = {
            users: users,
            page: page + 1,
            limit: limit,
            total: totalUser,
            start: limit * page + 1,
            end: offset + limit > totalUser ? totalUser : offset + limit,
        };

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getUser(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: {
                id,
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

        if (!user) return res.status(404).send("User not found!");

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function createUser(req, res) {
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

async function updateUser(req, res) {
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

async function deleteUser(req, res) {
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
module.exports.getSignedInUserProfile = getSignedInUserProfile;
module.exports.updateSignedInUserProfile = updateSignedInUserProfile;