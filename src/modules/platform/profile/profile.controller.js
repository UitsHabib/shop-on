const Profile = require('./profile.model');

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

module.exports.getProfiles = getProfiles;