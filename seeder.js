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
    const Shop = require(path.join(process.cwd(), 'src/modules/shop/shop.model'));
    const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));
    const Category = require(path.join(process.cwd(), 'src/modules/category/category.model'));
    const SubCategory = require(path.join(process.cwd(), 'src/modules/category/sub-category.model'));
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

    function shopSeeder(callback) {
        Shop.findOrCreate({
            where: {
                email: 'support@example.com'
            },
            defaults: {
                shop_name: 'shop 1',
                password: 'Aa@45678',
                description: 'Demo shop.',
                license_number: "df345rtr435rt"
            }
        }).then(function () {
            callback();
        });
    }

    function productSeeder(callback) {
        Product.findOrCreate({
            where: {
                id: 1
            },
            defaults: {
                product_name: 'product 1',
                price: 250.50,
                description: "Demo Product",
                category: "category 1",
                quantity: 5,
                shop_id: 1
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
                admin.update({ profile_id: sysAdminProfile.id }).then(function () {
                    callback();
                });
            });
        })
    }

    function categorySeeder(callback) {
        Category.findOrCreate({
            where: {
                id: 1
            },
            defaults: {
                category: 'Category 1'
            }
        }).then(function () {
            callback();
        });
    }

    function subCategorySeeder(callback) {
        SubCategory.findOrCreate({
            where: {
                id: 1
            },
            defaults: {
                category_id: 1,
                sub_category: 'Sub Category 1'
            }
        }).then(function () {
            callback();
        });
    }

    async.waterfall([
        userSeeder,
        shopSeeder,
        productSeeder,
        userProfileSeeder,
        userUpdateSeeder,
        categorySeeder,
        subCategorySeeder
    ], function (err) {
        if (err) console.error(err);
        else console.info('DB seed completed!');
        process.exit();
    });
}

init();
