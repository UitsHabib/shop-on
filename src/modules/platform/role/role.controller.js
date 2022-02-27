const path = require('path');
const Role = require(path.join(process.cwd(), 'src/modules/platform/role/role.model'));
const User = require(path.join(process.cwd(), 'src/modules/platform/user/user.model'));
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const RolePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/role-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));
const { Op } = require('sequelize');

async function getRoles(req, res) {
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

        const roles = await Role.findAll({
            offset,
            limit,
            order,
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

        const totalRoles = await Role.count();

        const data = {
            roles,
            metaData: {
                page: page + 1,
                limit: limit,
                total: totalRoles,
                start: limit * page + 1,
                end: offset + limit > totalRoles ? totalRoles : offset + limit,
            }
        };

        res.status(200).send(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
}

async function getRole(req, res) {
    try {
        const role = await Role.findOne({
            where: {
                id: req.params.id
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
        const slug = makeCustomSlug(title);

        const [role, created] = await Role.findOrCreate({
            where: {
                slug
            },
            defaults: {
                title,
                slug,
                type,
                description,
                created_by: req.user.id,
                updated_by: req.user.id
            }
        });

        if (!created) return res.status(400).send('Role already exists!');

        permissions.forEach(async permissionId => {
            const permission = await Permission.findOne({ where: { id: permissionId }});

            if(permission) {
                await RolePermission.create({
                    permission_id: permission.id,
                    role_id: role.id
                });
            }
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
        const { title, type, description, permissions } = req.body;

        const role = await Role.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!role) return res.status(404).send('Role not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await role.update({ title, slug, updated_by: req.user.id });
        }

        if (type) await role.update({ type, updated_by: req.user.id });

        if (description) await role.update({ description, updated_by: req.user.id });

        if (permissions) {
            await RolePermission.destroy({ where: { role_id: role.id }});

            permissions.forEach(async permissionId => {
                await RolePermission.create({
                    permission_id: permissionId,
                    role_id: role.id
                });
            });
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
        const role = await Role.findOne({
            where: {
                id: req.params.id,
                type: { [Op.ne]: 'standard' }
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

        await RolePermission.destroy({ where: { role_id: role.id }});
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