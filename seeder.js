const path = require('path');
const async = require('async');
const { argv } = require('process');

const adminEmail = argv[2];
const adminPassword = argv[3];

async function init() {
    if (!adminEmail || !adminPassword) {
        console.log('\x1b[31m', 'WARN:', '\x1b[0m', 'Please provide admin email and password');
        console.log('\x1b[34m', 'i.e: ', '\x1b[0m', 'yarn seed "admin@gmail.com" "password"');
        return;
    }

    const config = require(path.join(process.cwd(), 'src/config/config'));
    await config.initEnvironmentVariables();

    const nodecache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

    const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${nodecache.getValue('DB_NAME')}`);

    const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
    const UserProfile = require(path.join(process.cwd(), 'src/modules/user/user-profile.model'));
    require(path.join(process.cwd(), 'src/modules/product/product.model'));

    await sequelize.sync();

    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: adminEmail }, defaults: {
                first_name: 'System',
                last_name: 'Admin',
                password: adminPassword,
            }
        }).then(function () {
            callback();
        });
    }

    function userProfileSeeder(callback) {
        User.findOne({ where: { email: adminEmail } }).then(admin => {
            const userProfiles = [
                { title: "System Admin", description: "This is the default profile for System Admin", created_by: admin.id, updated_by: admin.id },
                { title: "Site Admin", description: "This is the default profile for Site Admin", created_by: admin.id, updated_by: admin.id },
                { title: "Default Profile", description: "This is the default profile with no permission", created_by: admin.id, updated_by: admin.id }
            ];

            UserProfile.destroy({ truncate: { cascade: true } }).then(() => {
                UserProfile.bulkCreate(userProfiles, {
                    returning: true,
                    ignoreDuplicates: false
                }).then(function () {
                    callback();
                });
            });
        });
    }

    function userUpdateSeeder(callback) {
        User.findOne({
            where: { email: adminEmail }
        }).then(admin => {
            UserProfile.findOne({ where: { title: 'System Admin' } }).then(sysAdminProfile => {
                admin.update({ profile_id: sysAdminProfile.id }).then(function () {
                    callback();
                });
            });
        })
    }

    async.waterfall([
        userSeeder,
        userProfileSeeder,
        userUpdateSeeder
    ], function (err) {
        if (err) console.error(err);
        else console.log('\x1b[32m', 'DB seed completed!', '\x1b[0m');
        process.exit();
    });
}

init();
