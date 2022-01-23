const path = require("path");
const {getUserWithPermissionRelations} = require(path.join(process.cwd(), "src/modules/platform/user/permission/permission.js"));

async function getUserWithProfiles(id){ 
    const userWithPermissions = await getUserWithPermissionRelations({id});
    return userWithPermissions;
}

async function getProfilePermissions(profile) {
    const services = [];
    if (profile) {
        for (const profilePermission of profile.profile_permission) {
            let permission = profilePermission.permission;
            for (const permission_service of permission.permission_service) {
                services.push(permission_service.service);
            }
        }

        return services;
    }
}

async function getRolePermissions(userRole) {
    if (!userRole) return [];

    const services = [];

    for (const rolePermission of userRole.role_permission) {
        let permission = rolePermission.permission;
        for (const permission_service of permission.permission_service) {
            services.push(permission_service.service);
        }
    }

    return services;
}

async function isPermitted(userServices, allowedServices) {
    if(userServices.some( userService => allowedServices.includes(userService))){
        return true;
    }
    return false;
}



const ServiceGuard = (allowedServices) =>{
    return async function(req, res, next){
        const user = await getUserWithProfiles(req.user.id);
        const profileServices = await getProfilePermissions(user.profile);
        const roleServices = await getRolePermissions(user.role);
        const userServices  = profileServices.concat(roleServices);

        if(!isPermitted(userServices, allowedServices)){
            return res.status(403).send("Forbidden. You are not authorized.");
        } 

        next();
    }    
}

module.exports.ServiceGuard = ServiceGuard;