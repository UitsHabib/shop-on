const Role = require('./role.model');
const RolePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/role-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));

async function getRoles(req, res) {
    try {
        const roles = await Role.findAll({});

        res.status(200).send(roles);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function getRole(req, res) {
    try {
        const { id } = req.params;

        const role = await Role.findOne({
            where: {
                id
            }
        });

        if (!role) return res.status(404).send('Role not found!');

        res.status(200).send(role);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function createRole(req, res) {
    try {
        const { title, slug, description, permissions } = req.body;
        const userId = req.user.id;

        const slug = makeCustomSlug(title);

        const existRole = await Role.findOne({
            where: {
                slug
            }
        });

        if (existRole) return res.status(400).send('Role already exists!');

        const role = await Role.create({
            title,
            slug,
            description,
            created_by: userId,
            updated_by: userId
        });

        await RolePermission.create({
            permission_id: permissions,
            role_id: role.id
        });

        res.status(201).send(role);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function updateRole(req, res) {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const slug = makeCustomSlug(title);

        const role = await Role.findOne({
            where: {
                id: id
            },
        });

        if (!role) return res.status(404).send('Role not found!');

        await role.update({
            title: title,
            slug: slug
        });

        res.status(201).send(role);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function deleteRole(req, res) {
    try {
        const { id } = req.params;

        const role = await Role.findOne({
            where: {
                id
            }
        });

        if (!role) return res.status(404).send('Role not found!');

        await role.destroy();

        res.status(200).send(role);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

module.exports.getRoles = getRoles;
module.exports.getRole = getRole;
module.exports.createRole = createRole;
module.exports.updateRole = updateRole;
module.exports.deleteRole = deleteRole;