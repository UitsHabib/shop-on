const path = require('path');
const Permission = require(path.join(process.cwd(), 'src/modules/platform/permission/permission.model'));
const Service = require(path.join(process.cwd(), 'src/modules/platform/service/service.model'));
const User = require(path.join(process.cwd(), 'src/modules/platform/user/user.model'));
const ProfilePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/profile-permission.model'));
const RolePermission = require(path.join(process.cwd(), 'src/modules/platform/permission/role-permission.model'));
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));
const PermissionService = require(path.join(process.cwd(), 'src/modules/platform/permission/permission-service.model'));


async function getPermissions(req, res) {
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

        const permissions = await Permission.findAll({
            offset,
            limit,
            order,
            include: [
                {
                    model: PermissionService,
                    as: "permission_services",
                    attributes: ["id"],
                    include:[
                        {
                            model: Service,
                            as: "service",
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

        const totalPermissions = Permission.count();

        const data = {
            permissions,
            metaData: {
                page: page + 1,
                limit: limit,
                total: totalPermissions,
                start: limit * page + 1,
                end: offset + limit > totalPermissions ? totalPermissions : offset + limit,
            }
        }

        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error.");
    }
}

async function getPermission(req, res) {
    try {
        const { id } = req.params;

        const permission = await Permission.findOne(
            {
                where: {
                    id
                },
                include: [
                    {
                        model: PermissionService,
                        as: "permission_services",
                        attributes: ["id"],
                        include:[
                            {
                                model: Service,
                                as: "service",
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
            }
        );

        if (!permission) return res.status(404).send("Permission not found.");

        res.status(200).send(permission);

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error.");
    }
}

async function createPermission(req, res) {
    try {
        const { title, type, description, services } = req.body;
        const slug = makeCustomSlug(title);

        const existingPermission = await Permission.findOne({
            where: {
                slug
            }
        });

        if (existingPermission) return res.status(400).send('Permission already exists!');

        const permission = await Permission.create({
            title,
            slug,
            type,
            description,
            created_by: req.user.id,
            updated_by: req.user.id
        });

     
        services.forEach(async id => {
            const service = await Service.findOne({ where: { id }});

            if(service) {
                await PermissionService.create({
                    permission_id: permission.id,
                    service_id: service.id
                });
            }
        });       
       

        res.status(201).send(permission);
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error.");
    }
}

async function updatePermission(req, res) {
    try {
        const { title, type, description, services } = req.body;

        const permission = await Permission.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: PermissionService,
                    as: "permission_services"
                }
            ]
        });

        if (!permission) return res.status(404).send('Permission not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await permission.update({ title, slug });
        }

        if (type) await permission.update({ type });

        if (description) await permission.update({ description });

        if (services) {

            permission.permission_services.forEach( async () => {
                await PermissionService.destroy({ where: { permission_id: permission.id }})
            });

            services.forEach(async serviceId => {
                const service = await Service.findOne({ where: { id: serviceId }});

                if(service) {
                    await PermissionService.create({
                        permission_id: permission.id,
                        service_id: service.id
                    });
                }
            });
        }

        res.status(201).send(permission);
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal server error.");
    }
}

async function deletePermission(req,res) {
    try{
        const { id: permissionId } = req.params;

        const rolePermissions = await RolePermission.findAll({ where: { permission_id: permissionId }});
        if(rolePermissions.length > 0) return res.status(400).send('Permission assigned to roles.');

        const profilePermissions = await ProfilePermission.findAll({ where: { permission_id: permissionId }});
        if(profilePermissions.length > 0) return res.status(400).send('Permission assigned to profiles.');

        const permission = await Permission.findOne({ where: { id: permissionId, type: { [Op.ne]: 'standard' } }});
        if(!permission) return res.status(404).send('Permission not found.');

        await permission.destroy();
        await PermissionService.destroy({ where: { permission_id: permission.id }});

        res.status(200).send(permission);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal server error!');
    }
}

module.exports.getPermissions = getPermissions;
module.exports.getPermission = getPermission;
module.exports.createPermission = createPermission; 
module.exports.deletePermission = deletePermission; 
module.exports.updatePermission = updatePermission; 



