const Profile = require('./profile.model');
const path = require('path');
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));

async function getProfiles(req, res) {
    try {
        const profiles = await Profile.findAll({});

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
            }
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
        const { title, type, description } = req.body;
        // const userId = req.user.id;

        const existProfile = await Profile.findOne({
            where: {
                title,
            }
        });

        if (existProfile) return res.status(400).send('Profile already exists!');

        const slug = makeCustomSlug(title);

        const profile = await Profile.create({
            title,
            slug,
            type,
            description,
            created_by: 1,
            updated_by: 1
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
        const { id } = req.params;
        const { title } = req.body;
        const slug = titleToSlug(title);

        const profile = await Profile.findOne({
            where: {
                id: id
            },
        });

        if (!profile) return res.status(404).send('Profile not found!');

        await profile.update({
            title: title,
            slug: slug
        });

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
            }
        });

        if (!profile) return res.status(404).send('Profile not found!');

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