const path = require('path');
const async = require('async');

async function init() {
    const config = require(path.join(process.cwd(), 'src/config/config'));
    await config.initEnvironmentVariables();

    const nodecache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

    const sequelize = require(path.join(process.cwd(), 'src/config/lib/sequelize'));

    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${nodecache.getValue('DB_NAME')}`);

    const User = require(path.join(process.cwd(), 'src/modules/user/user.model'));
    const UserProfile = require(path.join(process.cwd(), 'src/modules/user/user-profile.model'));

    const Customer = require(path.join(process.cwd(), 'src/modules/customer/customer.model'));

    require(path.join(process.cwd(), 'src/modules/product/product.model'));

    await sequelize.sync();

    function userSeeder(callback) {
        User.findOrCreate({
            where: { email: 'habiburrahman3089@gmail.com' }, defaults: {
                first_name: 'System',
                last_name: 'Admin',
                password: 'P@ssword123'
            }
        }).then(function () {
            callback();
        });
    }

    function userProfileSeeder(callback) {
        User.findOne({ where: { email: 'habiburrahman3089@gmail.com' } }).then(admin => {
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
            where: { email: 'habiburrahman3089@gmail.com' }
        }).then(admin => {
            UserProfile.findOne({ where: { title: 'System Admin' } }).then(sysAdminProfile => {
                admin.update({ profile_id: sysAdminProfile.id }).then(function() {
                    callback();
                });
            });
        })
    }

    function customerSeeder(callback) {
        Customer.findOrCreate({
            where: { name: 'farhanSadek' }, defaults: {
                name : 'farhanSadek',
                address : 'Chittagong, Bangladesh',
                phone_number : '0178989898'
            }
        }).then(function () {
            callback();
        });
    }

    async.waterfall([
        userSeeder,
        userProfileSeeder,
        userUpdateSeeder,
        customerSeeder
    ], function (err) {
        if (err) console.error(err);
        else console.info('DB seed completed!');
        process.exit();
    });
}

init();
