const Permission = require("./permission.model");

async function getPermissions() {
    try {
        const permissions = Permission.findAll({});

        if (!permissions) return res.status(404).send("Permissions not found")
    } catch (err) { }
}
