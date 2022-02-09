const path = require("path");
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));
const Order = require(path.join(process.cwd(), 'src/modules/order/order.model'));
const { generateAccessToken } = require('./services/shop.service');
const Shop = require('./shop.model');
const cloudinary = require(path.join(process.cwd(), 'src/config/lib/cloudinary'));


async function registerShop(req, res) {
    try {
        const { shop_name, email, password, license_number } = req.body;

        const existShop = await Shop.findOne({
            where: {
                email
            }
        });
        if (existShop) return res.status(400).send('Duplicate email address.');

        const shop = await Shop.create({
            shop_name,
            email,
            password,
            license_number
        });

        res.status(201).send(shop);
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
        const { shop_name, email, password, description, license_number } = req.body;
        const file_url = await cloudinary.uploader.upload(req.file.path);

        const shop = await Shop.findOne({
            where: {
                id
            }
        });
        if (!shop) return res.status(404).send('Shop not found.');

        const existShop = await Shop.findOne({
            where: {
                email
            }
        });
        if (req.user.email !== shop.email && existShop) return res.status(400).send('Duplicate email address.');

        await shop.update({
            shop_name,
            email,
            password,
            description,
            license_number,
            shop_profile_image: file_url.secure_url
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
        const { shop_name, email, password, description, license_number, is_active } = req.body;
        const file_url = req.file && await cloudinary.uploader.upload(req.file.path);

        const shop = await Shop.findOne({
            where: {
                id
            }
        });
        if (!shop) return res.status(404).send('Shop not found.');

        if (email) {
            const existShop = await Shop.findOne({
                where: {
                    email
                }
            });
            if (req.user.email !== shop.email && existShop) return res.status(400).send('Duplicate email address.');

            await shop.update({ email });
        }
        if (password) await shop.update({ password });
        if (shop_name) await shop.update({ shop_name });
        if (description) await shop.update({ description });
        if (license_number) await shop.update({ license_number });
        if (is_active === true || is_active === false) await shop.update({ is_active: is_active ? '1' : '0' });
        if (file_url) await shop.update({ shop_profile_image: file_url.secure_url });

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

        const product = await Product.findOne({
            where: { 
                shop_id: id
            }
        })
        if (product) return res.status(400).send('Shop can not be deleted it has some products.');

        await shop.destroy();

        res.status(200).send(shop)
    }
    catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const shop = await Shop.findOne({
            where: {
                email
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
    res.clearCookie("refresh_token")
    res.status(200).send('Logged out.');
}

async function getShopProducts(req, res) {
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

        const products = await Product.findAll({
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

async function getShopProduct(req, res) {
    try {
        const { id, productId } = req.params;

        const product = await Product.findOne({
            where: {
                id: productId,
                shop_id: id
            },
            include: [
                {
                    model: Shop,
                    as: 'shops'
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

async function getShopOrders(req, res) {
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

async function getShopOrder(req, res) {
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
    const { id, orderId } = req.params;

	const order = await Order.findOne({
		where: {
			id: orderId,
			shop_id: id
		}
	});
	if (!order) return res.status(404).send("Order not found.");

    await order.update({ status: "accept" });

    res.status(200).send(order);
}


module.exports.registerShop = registerShop;
module.exports.getShop = getShop;
module.exports.updateShop = updateShop;
module.exports.updateShopInfo = updateShopInfo;
module.exports.deleteShop = deleteShop;
module.exports.login = login;
module.exports.logout = logout;
module.exports.getShopProducts = getShopProducts;
module.exports.getShopProduct = getShopProduct;
module.exports.getShopOrders = getShopOrders;
module.exports.getShopOrder = getShopOrder;
module.exports.acceptOrder = acceptOrder;