const path = require('path');
const Role = require('./role.model');
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const RolePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/role-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));

async function getRoles(req, res) {
    try {
        const roles = await Role.findAll({
            include: [
                {
                    model: RolePermission,
                    as: 'role_permissions',
                    attributes: ['id'],
                    include: [
                        {
                            model: Permission,
                            as: 'permission',
                            attributes: ["id", "title", "slug"]
                        }
                    ]
                }
            ]
        });

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
            },
            include: [
                {
                    model: RolePermission,
                    as: 'role_permissions',
                    attributes: ['id'],
                    include: [
                        {
                            model: Permission,
                            as: 'permission',
                            attributes: ["id", "title", "slug"]
                        }
                    ]
                }
            ]
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

        const existRole = await Role.findOne({
            where: {
                slug
            }
        });

        if (existRole) return res.status(400).send('Role already exists!');

        const role = await Role.create({
            title,
            slug,
            type,
            description,
            created_by: userId,
            updated_by: userId
        });

        permissions.forEach(async element =>
            await RolePermission.create({
                permission_id: element,
                role_id: role.id
            })
        );

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
        const { title, type, description, permissions } = req.body;
        const userId = req.user.id;

        const role = await Role.findOne({
            where: {
                id
            },
            include: [
                {
                    model: RolePermission,
                    as: "role_permissions"
                }
            ]
        });

        if (!role) return res.status(404).send('Role not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await role.update({ title, slug, updated_by: userId });
        }

        if (type) await role.update({ type, updated_by: userId });
        if (description) await role.update({ description, updated_by: userId });

        if (permissions) {
            permissions.forEach(async permissionId => {
                const permissionExist = await Permission.findOne({
                    where: {
                        id: permissionId
                    }
                });

                if (!permissionExist) return res.status(400).send('Bad request.');
            });

            role.role_permissions.forEach(async element =>
                await RolePermission.destroy({
                    where: {
                        role_id: role.id,
                    }
                })
            );

            permissions.forEach(async permissionId =>
                await RolePermission.create({
                    permission_id: permissionId,
                    role_id: role.id
                })
            );
        }

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
            },
            include: [
                {
                    model: RolePermission,
                    as: "role_permissions",
                    attributes: ['id'],
                    include: [
                        {
                            model: Permission,
                            as: 'permission',
                            attributes: ["id", "title", "slug"]
                        }
                    ]
                }
            ]
        });

        if (!role) return res.status(404).send('Role not found!');
        if (role.type == 'standard') return res.status(400).send("You can't delete default profile.");

        role.role_permissions.forEach(async element =>
            await RolePermission.destroy({
                where: {
                    role_id: role.id
                }
            })
        );

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