const path = require("path");
const async = require("async");

async function init() {
    const config = require(path.join(process.cwd(), "src/config/config"));
    await config.initEnvironmentVariables();

    const nodecache = require(path.join(process.cwd(), "src/config/lib/nodecache"));

    const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));

    await sequelize.query(
        `CREATE DATABASE IF NOT EXISTS ${nodecache.getValue("DB_NAME")}`
    );

    const User = require(path.join(process.cwd(), "src/modules/user/user.model"));
    const UserProfile = require(path.join(process.cwd(), "src/modules/user/user-profile.model"));
    const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
    const Profile = require(path.join(process.cwd(), "src/modules/platform/profile/profile.model"));

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

    function userProfileSeeder(callback) {
        User.findOne({ where: { email: "habiburrahman3089@gmail.com" } }).then(
            (admin) => {
                const userProfiles = [
                    {
                        title: "System Admin",
                        description:
                            "This is the default profile for System Admin",
                        created_by: admin.id,
                        updated_by: admin.id,
                    },
                    {
                        title: "Site Admin",
                        description:
                            "This is the default profile for Site Admin",
                        created_by: admin.id,
                        updated_by: admin.id,
                    },
                    {
                        title: "Default Profile",
                        description:
                            "This is the default profile with no permission",
                        created_by: admin.id,
                        updated_by: admin.id,
                    },
                ];

                UserProfile.destroy({ truncate: { cascade: true } }).then(
                    () => {
                        UserProfile.bulkCreate(userProfiles, {
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
            UserProfile.findOne({ where: { title: "System Admin" } }).then(
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

    function profileSeeder(callback) {
        Profile.findOrCreate({
            where: { id: 1 },
            defaults: {
                title: "Admin",
                slug: "admin",
                description: "Test admin profile.",
                created_by: 1,
                updated_by: 1
            },
        }).then(function () {
            callback();
        });
    }

    function serviceSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
            const services = [
                { id: 'b73fd725-6112-475d-9071-682ab7c1d462', title: "Management of Platform", slug: "platform-management", created_by: admin.id, updated_by: admin.id },
            ];

            Service.destroy({ truncate: { cascade: true } }).then(() => {
                Service.bulkCreate(services, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    const platform = Service.findOne({ where: { slug: 'platform-management' } });

                    Promise.all([platform]).then(values => {
                        const [platform] = values;

                        const platformServices = [
                            { id: '7e4dacf6-f26b-461f-b670-1bb37cd0f72e', title: "Manage Users", slug: "manage-users", description: 'Manage CDP users', created_by: admin.id, updated_by: admin.id },
                            { id: '3c8da3e9-856a-49e4-8d85-d3022eada329', title: "Manage Profiles", slug: "manage-user-profiles", description: 'Manage user profiles', created_by: admin.id, updated_by: admin.id },
                            { id: 'd3ab7f1b-bbce-4010-afb0-f8e2048de80f', title: "Manage Roles", slug: "manage-roles", description: 'Manage user roles', created_by: admin.id, updated_by: admin.id },
                            { id: '35ca4f49-142d-427b-a098-2ab269b18a7a', title: "Manage Permissions", slug: "manage-permissions", description: 'Assign rights to Permission', created_by: admin.id, updated_by: admin.id },
                        ];

                        const allServices = [
                            ...platformServices
                        ];

                        Service.bulkCreate(allServices, { returning: true, ignoreDuplicates: false }).then(res => { callback() });
                    })
                });
            });
        });
    }

    function permissionSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
            const permission = [
                { title: "System Admin Permission", slug: "system_admin", type: 'standard', description: "This is the default permission set for System Admin", created_by: admin.id, updated_by: admin.id },
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
                Service.findOne({ where: { slug: 'platform-management' }, include: { model: Service, as: 'childServices' } }),
                PermissionSet.findOne({ where: { slug: 'system_admin' } }),
            ]).then((values) => {
                const [
                    platformService,
                    systemAdmin_permission,
                ] = values;

                const permission_service = [
                    { permission_id: systemAdmin_permission.id, service_id: platformService.id },
                ];

                if (platformService.childServices) {
                    platformServiceCategory.childServices.forEach(service => {
                        permission_service.push({ permissionset_id: systemAdmin_permissionSet.id, service_id: service.id });
                    });
                }

                Permission_Service.destroy({ truncate: { cascade: true } }).then(() => {
                    Permissiont_Service.bulkCreate(permission_service, {
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
        const systemAdminProfile = UserProfile.findOne({ where: { slug: 'system_admin' } });
        const systemAdminPermission = Permission.findOne({ where: { slug: 'system_admin' } });

        Promise.all([systemAdminProfile, systemAdminPermission]).then((values) => {
            const profile_permission = [
                { profile_id: values[0].id, permission_id: values[1].id },
                { profile_id: values[2].id, permission_id: values[3].id },
                { profile_id: values[6].id, permission_id: values[7].id },
                { profile_id: values[4].id, permission_id: values[5].id },
                { profile_id: values[8].id, permission_id: values[9].id }
            ];

            Profile_Permission.destroy({ truncate: { cascade: true } }).then(() => {
                Profile_Permission.bulkCreate(profile_permission, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    callback();
                });
            });
        });
    }

    async.waterfall(
        [userSeeder, userProfileSeeder, userUpdateSeeder, profileSeeder, serviceSeeder, permissionSeeder, permissionServiceSeeder, profilePermissionSeeder],
        function (err) {
            if (err) console.error(err);
            else console.info("DB seed completed!");
            process.exit();
        }
    );
}

init();
