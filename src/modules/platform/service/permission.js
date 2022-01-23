const path = require('path');
const _ = require('lodash');

const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
const Profile_Permission = require(path.join(process.cwd(), "src/modules/platform/permission/Profile-permission.model"));
const Role_Permission = require(path.join(process.cwd(), "src/modules/platform/permission/role-permission.model"));
const Role = require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
const Permission = require(path.join(process.cwd(), "src/modules/platform/permission/permission.model"));
const User = require(path.join(process.cwd(), 'src/modules/platform/user/user.model'));
const Permission_Service = require(path.join(process.cwd(), "src/modules/platform/permission/permission-service.model"));
const Service = require(path.join(process.cwd(), "src/modules/platform/service/service.model"));

const getUserWithPermissionRelations = async (whereCondition) => {
    const user = await User.findOne({
        where: whereCondition,
        include: [{
            model: Profile,
            as: 'profile',
            include: [{
                model: Profile_Permission,
                as: 'profile_permission',
                include: [{
                    model: Permission,
                    as: 'permission',
                    include: [
                        {
                            model: Permission_Service,
                            as: 'permission_service',
                            include: [
                                {
                                    model: Service,
                                    as: 'service',
                                }
                            ]
                        },
                    ]
                }]
            }]
        },
        {
            model: Role,
            as: 'role',
            include: [{
                model: Role_Permission,
                as: 'role_permission',
                include: [{
                    model: Permission,
                    as: 'permission',
                    include: [
                        {
                            model: Permission_Service,
                            as: 'permission',
                            include: [
                                {
                                    model: Service,
                                    as: 'service',
                                }
                            ]
                        },
                    ]
                }]
            }]
        }]
    });
    return user;
}

async function getProfileAndRolePermissions(user) {
    let services = [];

    if (user.Profile) {
        const profilePermissions = user.Profile.profile_permission;
        for (const profilePermission of profilePermissions) {
            const [profile_services] = await getPermissionsFromPermission(profilePermission.permission);
            services = services.concat(profile_services);
        }
    }

    if (user.role) {
        for (const rolePermission of user.role.role_permission) {
            const [role_services] = await getPermissionsFromPermission(rolePermission.permission);
            services = services.concat(role_services);
        }
    }

    const user_services = _.uniqBy(services, sc => sc.slug);

    return [user_services];
}

async function getUserPermissions(userId) {
    const user = await getUserWithPermissionRelations({ id: userId });

    if(!user) return [[], [], []];

    const [user_services] = await getProfileAndRolePermissions(user);

    return [user_services];
}

async function getPermissionsFromPermission(permission) {
    let services = [];

    if(permission.permission){
        for (const permission of permission.permission) {
            const userService = permission.service;

            if (userService) services.push(userServiceCategory);
        }
    }

    return [applications, countries, services];
}

async function getRequestingUserPermissions(user) {
    if(!user) return [[], [], []];
    const [user_services] = await getProfileAndRolePermissions(user);
    return [user_services];
}

module.exports.getUserPermissions = getUserPermissions;
module.exports.getRequestingUserPermissions = getRequestingUserPermissions;
module.exports.getPermissionsFromPermission = getPermissionsFromPermission;
module.exports.getUserWithPermissionRelations = getUserWithPermissionRelations;
