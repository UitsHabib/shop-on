const path = require("path");
const async = require("async");

async function init() {
    const config = require(path.join(process.cwd(), "src/config/config"));
    await config.initEnvironmentVariables();

    const nodecache = require(path.join(process.cwd(), "src/config/lib/nodecache"));

    const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${nodecache.getValue("DB_NAME")}`);

    const User = require(path.join(process.cwd(), "src/modules/platform/user/user.model"));
    const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));
    const PermissionService = require(path.join(process.cwd(), "src/modules/platform/permission/permission-service.model"));
    const Permission = require(path.join(process.cwd(), "src/modules/platform/permission/permission.model"));
    const ProfilePermission = require(path.join(process.cwd(), "src/modules/platform/permission/profile-permission.model"));
    const Service = require(path.join(process.cwd(), "src/modules/platform/service/service.model"));
    
    require(path.join(process.cwd(), "src/modules/platform/permission/role-permission.model"));
    require(path.join(process.cwd(), "src/modules/platform/role/role.model"));
    require(path.join(process.cwd(), 'src/modules/customer/customer.model'));
    require(path.join(process.cwd(), 'src/modules/shop/shop.model'));
    require(path.join(process.cwd(), 'src/modules/product/product.model'));
    require(path.join(process.cwd(), 'src/modules/category/category.model'));
    require(path.join(process.cwd(), 'src/modules/category/sub-category.model'));
    require(path.join(process.cwd(), 'src/modules/order/order-product.model'));
    require(path.join(process.cwd(), 'src/modules/order/order.model'));
    require(path.join(process.cwd(), 'src/modules/cart/cart.model'));
    require(path.join(process.cwd(), 'src/modules/review/review.model'));

    await sequelize.sync();

    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: "habiburrahman3089@gmail.com" },
            defaults: {
                first_name: "System",
                last_name: "Admin",
                password: "P@ssword123",
            },
        }).then(function () {
            callback();
        });
    }

    function profileSeeder(callback) {
        User.findOne({ where: { email: "habiburrahman3089@gmail.com" } }).then(
            (admin) => {
                const profiles = [
                    {
                        title: "System Admin",
                        slug: "system-admin",
                        type: 'standard',
                        description: "This is the default profile for System Admin",
                        created_by: admin.id,
                        updated_by: admin.id,
                    }
                ];

                Profile.destroy({ truncate: { cascade: true } }).then(
                    () => {
                        Profile.bulkCreate(profiles, {
                            returning: true,
                            ignoreDuplicates: false,
                        }).then(function () {
                            callback();
                        });
                    }
                );
            }
        );
    }

    function userUpdateSeeder(callback) {
        User.findOne({
            where: { email: "habiburrahman3089@gmail.com" },
        }).then((admin) => {
            Profile.findOne({ where: { title: "System Admin" } }).then(
                (sysAdminProfile) => {
                    admin
                        .update({ profile_id: sysAdminProfile.id })
                        .then(function () {
                            callback();
                        });
                }
            );
        });
    }

    function serviceSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
            const services = [
                { title: "Management of Platform", slug: "platform-management", created_by: admin.id, updated_by: admin.id },
                { title: "Manage Users", slug: "manage-users", description: 'Manage CDP users', created_by: admin.id, updated_by: admin.id },
                { title: "Manage Profiles", slug: "manage-profiles", description: 'Manage user profiles', created_by: admin.id, updated_by: admin.id },
                { title: "Manage Roles", slug: "manage-roles", description: 'Manage user roles', created_by: admin.id, updated_by: admin.id },
                { title: "Manage Permissions", slug: "manage-permissions", description: 'Assign rights to Permission', created_by: admin.id, updated_by: admin.id },
            ];

            Service.destroy({ truncate: { cascade: true } }).then(() => {
                Service.bulkCreate(services, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    callback();
                });
            });
        });
    }

    function permissionSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
            const permission = [
                { title: "System Admin Permission", slug: "system-admin", type: 'standard', description: "This is the default permission set for System Admin", created_by: admin.id, updated_by: admin.id },
            ];

            Permission.destroy({ truncate: { cascade: true } }).then(() => {
                Permission.bulkCreate(permission, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    callback();
                });
            });
        });
    }

    function permissionServiceSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
            Promise.all([
                Service.findOne({ where: { slug: 'platform-management' } }),
                Service.findOne({ where: { slug: 'manage-users' } }),
                Service.findOne({ where: { slug: 'manage-profiles' } }),
                Service.findOne({ where: { slug: 'manage-roles' } }),
                Service.findOne({ where: { slug: 'manage-permissions' } }),
                Permission.findOne({ where: { slug: 'system-admin' } }),
            ]).then((values) => {
                const [
                    platformService,
                    userService,
                    profileService,
                    roleService,
                    permissionService,
                    systemAdminPermission,
                ] = values;

                const permissionServices = [
                    { permission_id: systemAdminPermission.id, service_id: platformService.id },
                    { permission_id: systemAdminPermission.id, service_id: userService.id },
                    { permission_id: systemAdminPermission.id, service_id: profileService.id },
                    { permission_id: systemAdminPermission.id, service_id: roleService.id },
                    { permission_id: systemAdminPermission.id, service_id: permissionService.id },
                ];

                PermissionService.destroy({ truncate: { cascade: true } }).then(() => {
                    PermissionService.bulkCreate(permissionServices, {
                        returning: true,
                        ignoreDuplicates: false
                    }).then(function () {
                        callback();
                    });
                });
            });
        });
    }

    function profilePermissionSeeder(callback) {
        Promise.all([
            Profile.findOne({ where: { slug: 'system-admin' } }),
            Permission.findOne({ where: { slug: 'system-admin' } })
        ]).then((values) => {
            const [systemAdminProfile, systemAdminPermission] = values;

            const profilePermissions = [
                { profile_id: systemAdminProfile.id, permission_id: systemAdminPermission.id }
            ];

            ProfilePermission.destroy({ truncate: { cascade: true } }).then(() => {
                ProfilePermission.bulkCreate(profilePermissions, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    callback();
                });
            });
        });
    }

    async.waterfall(
        [userSeeder, profileSeeder, userUpdateSeeder, serviceSeeder, permissionSeeder, permissionServiceSeeder, profilePermissionSeeder],
        function (err) {
            if (err) console.error(err);
            else console.info("DB seed completed!");
            process.exit();
        }
    );
}

init();