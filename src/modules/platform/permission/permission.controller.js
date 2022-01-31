const path = require('path');
const Permission = require("./permission.model");
const { makeCustomSlug } = require(path.join(process.cwd(), 'src/modules/core/services/slug'));


async function getPermissions(req, res) {
    try {
        const permissions = Permission.findAll({
            include:[{ /* write here */ }]
        });

        if (!permissions) return res.status(404).send("Permissions not found");

        return res.status(202).send(permissions);
    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}

async function createPermissions(req, res) {
    try {
        const { title, type, description } = req.body;

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
            created_by: 1,
            updated_by: 1
        });

        res.status(201).send(permission);
    } 
    catch (err) {
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

async function updatePermission(req, res) {
    try {
        const { id } = req.params;
        const { title, type, description } = req.body;

        const permission = await Permission.findOne({
            where: {
                id
            },
        });

        if (!permission) return res.status(404).send('Permission not found!');

        if (title) {
            const slug = makeCustomSlug(title);
            await permission.update({ title, slug });
        }

        if (type) await permission.update({ type });
        if (description) await permission.update({ description });

        res.status(201).send(profile);

    } catch (err) {
        return res.status(500).send("Internal server error.");
    }
}

async function deletePermission(req,res) {
    try{
        const {id} = req.params;
        
        const permission = await Permission.findOne({
            where:{
                id,
            }
        })

        if(!permission) return res.status(404).send('Permission not found!');

        await permission.destroy();

        res.status(200).send(permission);
    }
    catch (err) {
        res.status(500).send('Internal server error!');
    }
}




module.exports.getPermissions = getPermissions;
module.exports.getPermissionsById = getPermissionsById;
module.exports.createPermissions = createPermissions; 
module.exports.deletePermission = deletePermission; 
module.exports.updatePermission = updatePermission; 


