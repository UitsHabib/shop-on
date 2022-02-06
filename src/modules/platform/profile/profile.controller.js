const path = require('path');
const Profile = require('./profile.model');
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const ProfilePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/profile-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));

async function getProfiles(req, res) {
    try {
        const profiles = await Profile.findAll({
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
                }
            ]
        });

        res.status(200).send(profiles);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function getProfile(req, res) {
    try {
        const { id } = req.params;

        const profile = await Profile.findOne({
            where: {
                id
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
                    ]
                }
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
        const userId = req.user.id;

        permissions.forEach(async permissionId => {
            const permissionExist = await Permission.findOne({
                where: {
                    id: permissionId
                }
            });

            if (!permissionExist) return res.status(400).send('Bad request.');
        });

        const slug = makeCustomSlug(title);

        const existProfile = await Profile.findOne({
            where: {
                slug
            }
        });

        if (existProfile) return res.status(400).send('Profile already exists!');

        const profile = await Profile.create({
            title,
            slug,
            type,
            description,
            created_by: userId,
            updated_by: userId
        });

        permissions.forEach(async element =>
            await ProfilePermission.create({
                permission_id: element,
                profile_id: profile.id
            })
        );

        res.status(201).send(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function updateProfile(req, res) {
    try {
        const { id } = req.params;
        const { title, type, description, permissions } = req.body;
        const userId = req.user.id;

        const profile = await Profile.findOne({
            where: {
                id
            },
            include: [
                {
                    model: ProfilePermission,
                    as: "profile_permissions"
                }
            ]
        });

        if (!profile) return res.status(404).send('Profile not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await profile.update({ title, slug, updated_by: userId });
        }

        if (type) await profile.update({ type, updated_by: userId });
        if (description) await profile.update({ description, updated_by: userId });

        if (permissions) {
            permissions.forEach(async permissionId => {
                const permissionExist = await Permission.findOne({
                    where: {
                        id: permissionId
                    }
                });

                if (!permissionExist) return res.status(400).send('Bad request.');
            });

            profile.profile_permissions.forEach(async element =>
                await ProfilePermission.destroy({
                    where: {
                        profile_id: profile.id
                    }
                })
            );

            permissions.forEach(async permissionId =>
                await ProfilePermission.create({
                    permission_id: permissionId,
                    profile_id: profile.id
                })
            );
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
        const { id } = req.params;

        const profile = await Profile.findOne({
            where: {
                id
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
                    ]
                }
            ]
        });

        if (!profile) return res.status(404).send('Profile not found!');
        if (profile.type == 'standard') return res.status(400).send("You can't delete default profile.");

        profile.profile_permissions.forEach(async element =>
            await ProfilePermission.destroy({
                where: {
                    profile_id: profile.id
                }
            })
        );

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