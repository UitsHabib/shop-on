const Product = require('../product/product.model');
const { generateAccessToken } = require('./services/shop.service');
const Shop = require('./shop.model');

async function createShop(req, res) {
    try {
        const { shop_name, password, description, registration_number } = req.body;

        const existShop = await Shop.findOne({
            where: {
                shop_name
            }
        });

        if (existShop) return res.status(400).send('Duplicate shop name.');

        const shop = await Shop.create({
            shop_name,
            password,
            description,
            registration_number
        });

        res.cookie("access_token", generateAccessToken(shop), { httpOnly: true, sameSite: true, signed: true });

        res.status(201).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getShops(req, res) {
    try {
        const shops = await Shop.findAll();

        res.status(200).send(shops);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getShop(req, res) {
    try {
        const { id } = req.params;
        const shop = await Shop.findOne({
            where: {
                id
            }
        });

        if (!shop) return res.status(404).send('Shop not found.');

        res.status(200).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateShop(req, res) {
    try {
        const { id } = req.params;
        const { shop_name, password, description, registration_number } = req.body;

        const shop = await Shop.findOne({
            where: {
                id
            }
        });
        if (!shop) return res.status(404).send('Shop not found.');

        const shop_name_exists = await Shop.findOne({
            where: {
                shop_name
            }
        })
        if (shop_name_exists) return res.status(400).send('Duplicate shop name.');

        await shop.update({
            shop_name,
            password,
            description,
            registration_number
        });

        res.status(201).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateShopInfo(req, res) {
    try {
        const { id } = req.params;
        const { shop_name, password, description, registration_number } = req.body;

        const shop = await Shop.findOne({
            where: {
                id
            }
        });
        if (!shop) return res.status(404).send('Shop not found.');

        if (shop_name) {
            const shop_name_exists = await Shop.findOne({
                where: {
                    shop_name
                }
            })
            if (shop_name_exists) return res.status(400).send('Duplicate shop name.');

            await shop.update({ shop_name });
        }
        if (password) await shop.update({ password });
        if (description) await shop.update({ description });
        if (registration_number) await shop.update({ registration_number });

        res.status(201).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function deleteShop(req, res) {
    try {
        const { id } = req.params;

        const shop = await Shop.findOne({
            where: {
                id
            }
        })
        if (!shop) return res.status(404).send('Shop not found.');

        Product.destroy({
            where: { shop_id: id }
        })

        await shop.destroy();

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        res.status(200).send(shop)
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function login(req, res) {
    try {
        const { shop_name, password } = req.body;

        const shop = await Shop.findOne({
            where: {
                shop_name
            }
        })

        if (!shop || !shop.password || !shop.validPassword(password))
            return res.status(400).send('Invalid Credentials.');

        res.cookie("access_token", generateAccessToken(shop), { httpOnly: true, sameSite: true, signed: true });

        res.status(200).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function logout(req, res) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token").send('Logged out.');
}

async function getShopAllProduct(req, res) {
    try {
        const { id } = req.params;

        const products = await Product.findAll({
            where: {
                shop_id: id
            }
        });

        res.status(200).send(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getShopSingleProduct(req, res) {
    try {
        const { id, productId } = req.params;

        const product = await Product.findOne({
            where: {
                id: productId,
                shop_id: id
            }
        });

        if (!product) return res.status(404).send("Product not found.");

        res.status(200).send(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

module.exports.createShop = createShop;
module.exports.getShops = getShops;
module.exports.getShop = getShop;
module.exports.updateShop = updateShop;
module.exports.updateShopInfo = updateShopInfo;
module.exports.deleteShop = deleteShop;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getShopAllProduct = getShopAllProduct;
module.exports.getShopSingleProduct = getShopSingleProduct;