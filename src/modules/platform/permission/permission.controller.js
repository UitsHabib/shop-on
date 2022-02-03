const path = require('path');
const Permission = require("./permission.model");
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));
const PermissionService = require("./permission-service.model")


async function getPermissions(req, res) {
    try {
        const permissions = await Permission.findAll({
            include: [
                {
                    model: PermissionService,
                    as: "permission_services"
                }
            ]
        });

        if (!permissions) return res.status(404).send("Permissions not found");
        console.log(permissions);
        res.status(200).send(permissions);
    } catch (err) {
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
                        as: "permission_services"
                    }
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

async function createPermissions(req, res) {
    try {
        const userId = req.user.id;
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
            created_by: userId,
            updated_by: userId
        });

     
        services.forEach(async id => 
            await PermissionService.create({
            permission_id: permission.id,
            service_id: id
            })
        );       
       

        res.status(201).send(permission);
    } 
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error.");
    }
}

async function updatePermission(req, res) {
    try {
        const { id } = req.params;
        const { title, type, description, services } = req.body;

        const permission = await Permission.findOne({
            where: {
                id
            },
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

            permission.permission_services.forEach( async service => {
                await PermissionService.destroy({where:{permission_id:permission.id}})
            })

            services.forEach(async serviceId => {
                await PermissionService.create({
                    permission_id: permission.id,
                    service_id: serviceId
                });
            });
        }

        // const updatedPermission = await Permission.findOne({
        //     where: {
        //         id
        //     },
        //     include: [
        //         {
        //             model: PermissionService,
        //             as: "permission_services"
        //         }
        //     ]
        // });

        res.status(201).send(permission);

    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal server error.");
    }
}

async function deletePermission(req,res) {
    try{
        const {id} = req.params;
        
        const permission = await Permission.findOne({
            where:{
                id,
            },
            include: [
                {
                    model: PermissionService,
                    as: "permission_services"
                }
            ]
        })

        if(!permission) return res.status(404).send('Permission not found!');

        permission.permission_services.forEach( async service => {
            await PermissionService.destroy({where:{permission_id:permission.id}})
        })
        
        await permission.destroy();

        res.status(200).send(permission);
    }
    catch (err) {
        res.status(500).send('Internal server error!');
    }
}

module.exports.getPermissions = getPermissions;
module.exports.getPermission = getPermission;
module.exports.createPermissions = createPermissions; 
module.exports.deletePermission = deletePermission; 
module.exports.updatePermission = updatePermission; 


