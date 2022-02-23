const path = require('path');
const Profile = require(path.join(process.cwd(), 'src/modules/platform/profile/profile.model'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const User = require(path.join(process.cwd(), 'src/modules/platform/user/user.model'));
const ProfilePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/profile-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));
const { Op } = require('sequelize');

async function getProfiles(req, res) {
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
            "title",
            "slug",
            "type",
            "description",
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

        // const filterOptions = { id: { [Op.ne]: req.user.id } };

        const profiles = await Profile.findAll({
            offset,
            limit,
            order,
            include: [
                {
                    model: ProfilePermission,
                    as: "profile_permissions",
                    attributes: ["id"],
                    include: [
                        {
                            model: Permission,
                            as: "permission",
                            attributes: ["id", "title", "slug"]
                        }
                    ]
                },
                {
                    model: User,
                    as: "createdByUser",
                    attributes: ["id", "first_name", "last_name"]
                },
                {
                    model: User,
                    as: "updatedByUser",
                    attributes: ["id", "first_name", "last_name"]
                },
            ]
        });

        const totalProfiles = await Profile.count();

        const data = {
            profiles,
            metaData: {
                page: page + 1,
                limit: limit,
                total: totalProfiles,
                start: limit * page + 1,
                end: offset + limit > totalProfiles ? totalProfiles : offset + limit,
            }
        };

        res.status(200).send(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function getProfile(req, res) {
    try {
        const profile = await Profile.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: ProfilePermission,
                    as: "profile_permissions",
                    attributes: ["id"],
                    include: [
                        {
                            model: Permission,
                            as: "permission",
                            attributes: ["id", "title", "slug"]
                        }
                    ],
                },
                {
                    model: User,
                    as: "createdByUser",
                    attributes: ["id", "first_name", "last_name"]
                },
                {
                    model: User,
                    as: "updatedByUser",
                    attributes: ["id", "first_name", "last_name"]
                },
            ]
        });

        if (!profile) return res.status(404).send('Profile not found!');

        res.status(200).send(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function createProfile(req, res) {
    try {
        const { title, type, description, permissions } = req.body;
        const slug = makeCustomSlug(title);

        const [profile, created] = await Profile.findOrCreate({
            where: { slug },
            defaults: {
                title,
                slug,
                type,
                description,
                created_by: req.user.id,
                updated_by: req.user.id
            }
        });

        if (!created) return res.status(400).send('Profile already exists!');

        permissions.forEach(async permissionId => {
            const permission = await Permission.findOne({ where: { id: permissionId }});

            if(permission) {
                await ProfilePermission.create({
                    permission_id: permission.id,
                    profile_id: profile.id
                });
            }
        });

        res.status(201).send(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function updateProfile(req, res) {
    try {
        const { title, type, description, permissions } = req.body;

        const profile = await Profile.findOne({ where: { id: req.params.id }});
        if (!profile) return res.status(404).send('Profile not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await profile.update({ title, slug, updated_by: req.user.id });
        }

        if (type) await profile.update({ type, updated_by: req.user.id });

        if (description) await profile.update({ description, updated_by: req.user.id });

        if (permissions) {
            await ProfilePermission.destroy({ where: { profile_id: profile.id }});

            permissions.forEach(async permissionId => {
                const permission = await Permission.findOne({ where: { id: permissionId }});

                if (permission) {
                    await ProfilePermission.create({
                        permission_id: permission.id,
                        profile_id: profile.id
                    });
                }
            });
        }

        res.status(201).send(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function deleteProfile(req, res) {
    try {
        const profile = await Profile.findOne({
            where: {
                id: req.params.id,
                type: { [Op.ne]: 'standard' }
            }
        });

        if (!profile) return res.status(404).send('Profile not found!');

        await ProfilePermission.destroy({ where: { profile_id: profile.id }});
        await profile.destroy();

        res.status(200).send(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

module.exports.getProfiles = getProfiles;
module.exports.getProfile = getProfile;
module.exports.createProfile = createProfile;
module.exports.updateProfile = updateProfile;
module.exports.deleteProfile = deleteProfile;