const Permission = require("./permission.model");

async function getPermissions(req, res) {
    try {
        const permissions = Permission.findAll({});

        if (!permissions) return res.status(404).send("Permissions not found");

        return res.status(202).send(permissions);
    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}

async function createPermissions(req, res) {
    try {

    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}

async function getPermissionsById(req, res) {
    try {
        const { id } = req.params;

        const permissions = Permission.findOne(
            {
                where: id,
            }
        );

        if (!permissions) return res.status(404).send("Permission not found.");

        res.status(200).send(permissions);

    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}

async function updatePermissions(req, res) {
    try {

    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}




module.exports.getPermissions = getPermissions;
module.exports.getPermissionsById = getPermissionsById;
module.exports.createPermissions = createPermissions; 
