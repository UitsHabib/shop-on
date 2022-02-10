const path = require("path");
const { getUserWithPermissionRelations } = require(path.join(process.cwd(), "src/modules/platform/service/permission"));

async function getUserWithProfiles(id) {
    const userWithPermissions = await getUserWithPermissionRelations({ id });
    return userWithPermissions;
}

async function getProfilePermissions(profile) {
    const services = [];

    if (profile) {
        for (const profilePermission of profile.profile_permissions) {
            const permission = profilePermission.permission;
            for (const permission_service of permission.permission_services) {
                services.push(permission_service.service);
            }
        }

        return services;
    }
}

async function getRolePermissions(role) {
    if (!role) return [];

    const services = [];

    for (const rolePermission of role.role_permissions) {
        const permission = rolePermission.permission;
        for (const permission_service of permission.permission_services) {
            services.push(permission_service.service);
        }
    }

    return services;
}

function isPermitted(userServices, allowedServices) {
    if (userServices.some(userService => allowedServices.includes(userService.slug))) {
        return true;
    }
    return false;
}

const ServiceGuard = (allowedServices) => {
    return async function (req, res, next) {
        const user = await getUserWithProfiles(req.user.id);
        const profileServices = await getProfilePermissions(user.profile);
        const roleServices = await getRolePermissions(user.role);
        const userServices = profileServices.concat(roleServices);

        console.log(userServices);
        console.log(allowedServices);
        console.log(isPermitted(userServices, allowedServices));


        if (!isPermitted(userServices, allowedServices)) {
            return res.status(403).send("Forbidden. You are not authorized.");
        }
        next();
    }
}

module.exports.ServiceGuard = ServiceGuard;