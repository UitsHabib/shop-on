const path = require("path");
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));
// const Order = require(path.join(process.cwd(), 'src/modules/order/order.model'));
const { generateAccessToken } = require('./services/shop.service');
const Shop = require('./shop.model');
const cloudinary = require(path.join(process.cwd(), 'src/config/lib/cloudinary'));


async function login(req, res) {
    try {
        const { email, password } = req.body;

        const shop = await Shop.findOne({ where: { email }});

        if (!shop || !shop.password || !shop.validPassword(password)) return res.status(400).send('Invalid Credentials.');

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
    res.send('Logged out.');
}

async function registerShop(req, res) {
    try {
        const { name, email, password, license_number } = req.body;

        const [shop, created] = await Shop.findOrCreate({
            where: { email: email.toLowerCase() },
            defaults: {
                name,
                email,
                password,
                license_number
            },
        });

        if (!created) return res.status(400).send("Already registered with this email address.");

        res.status(201).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getSignedInShopProfile (req, res) {
    try {
        const shop = await Shop.findOne({ where: { id: req.user.id }});

        if (!shop) return res.status(404).send('Shop not found.');

        res.status(200).send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateSignedInShopProfile (req, res) {
    try {
        const { name, description, password, license_number } = req.body;

        const shop = await Shop.findOne({ where: { id: req.user.id }});
        
        if (!shop) return res.status(404).send('Shop not found.');

        await shop.update({ name, description, password, license_number });

        if(req.file?.path) {
            const file_url = await cloudinary.uploader.upload(req.file.path);
            await shop.update({ profile_image: file_url.secure_url });
        }

        res.send(shop);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function addProduct(req, res) {
    try {
        const { category_id, name, price, description, stock_quantity } = req.body;

        const product = await Product.create({
            shop_id: req.user.id,
            category_id,
            name,
            price,
            description,
            stock_quantity
        });

        if(req.file?.filename) await product.update({ profile_image: req.file.filename });

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error.");
    }
};

async function updateProduct(req, res) {
    try {
        const { category_id, name, price, description, stock_quantity } = req.body;

        const product = await Product.findOne({ where: { id: req.params.id }});

        if (!product) return res.status(404).send('Product not found.');

        await product.update({ category_id, name, price, description, stock_quantity });

        if(req.file?.path) {
            const file_url = await cloudinary.uploader.upload(req.file.path);
            await product.update({ profile_image: file_url.secure_url });
        }

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function getProducts(req, res) {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 15;
        const offset = (page - 1) * limit;
        let { orderBy, orderType } = req.query;
        orderType = orderType || 'asc';
        let order = [['created_at', 'desc']];

        if (orderBy) {
            order.push([orderBy, orderType]);
        }

        const products = await Product.findAll({
            where: {
                shop_id: req.user.id
            },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ],
            offset,
            limit,
            order
        });

        const total = await Product.count();

        const data = {
            products,
            meta: {
                start: offset + 1,
                end: Math.min(total, page * limit),
                total,
                page
            }
        };

        res.status(200).send(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getProduct(req, res) {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ]
        });

        if (!product) return res.status(404).send("Product not found.");

        res.status(200).send(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function deleteProduct(req, res) {
    try {
        const product = await Product.findOne({ where: { id: req.params.id }});
        
        if (!product) return res.status(404).send("Product not found.");

        await product.destroy();

        res.status(200).send(product);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getOrders(req, res) {
    try {
        const { id } = req.params;

        const page = +req.query.page || 1;
        const limit = +req.query.limit || 15;
        const offset = (page - 1) * limit;
        let { orderBy, orderType } = req.query;
        orderType = orderType || 'asc';
        let order = [['created_at', 'desc']];

        if (orderBy) {
            order.push([orderBy, orderType]);
        }

        const orders = await Order.findAll({
            where: {
                shop_id: id
            },
            include: [
                {
                    model: Shop,
                    as: 'shops'
                }
            ],
            offset,
            limit,
            order
        });

        const total = await Order.count();

        const data = {
            orders,
            meta: {
                start: offset + 1,
                end: Math.min(total, page * limit),
                total,
                page
            }
        };

        res.status(200).send(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getOrder(req, res) {
    try {
        const { id, orderId } = req.params;

        const order = await Order.findOne({
            where: {
                id: orderId,
                shop_id: id
            },
            include: [
                {
                    model: Shop,
                    as: 'shops'
                }
            ]
        });
        if (!order) return res.status(404).send("Order not found.");

        res.status(200).send(order);
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function acceptOrder(req, res) {
    try {
        const { id, orderId } = req.params;

        const order = await Order.findOne({
            where: {
                id: orderId,
                shop_id: id
            }
        });
        if (!order) return res.status(404).send("Order not found.");

        await order.update({ order_status: "accept" });

        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}


module.exports.login = login;
module.exports.logout = logout;
module.exports.registerShop = registerShop;
module.exports.getSignedInShopProfile = getSignedInShopProfile;
module.exports.updateSignedInShopProfile = updateSignedInShopProfile;

module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.deleteProduct = deleteProduct;

module.exports.getOrders = getOrders;
module.exports.getOrder = getOrder;
module.exports.acceptOrder = acceptOrder;