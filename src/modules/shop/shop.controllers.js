const path = require("path");
const Category = require(path.join(process.cwd(), "src/modules/category/category.model"));
const Product = require(path.join(process.cwd(), 'src/modules/product/product.model'));
const Order = require(path.join(process.cwd(), 'src/modules/order/order.model'));
const OrderProduct = require(path.join(process.cwd(), 'src/modules/order/order-product.model'));
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
        const { name, description, password, license_number, is_active } = req.body;

        const shop = await Shop.findOne({ where: { id: req.user.id }});

        if (!shop) return res.status(404).send('Shop not found.');

        await shop.update({ name, description, password, license_number, is_active });

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

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error.");
    }
};

async function updateProduct(req, res) {
    try {
        const { category_id, name, price, description, stock_quantity, discount } = req.body;

        const product = await Product.findOne({ where: { id: req.params.id }});

        if (!product) return res.status(404).send('Product not found.');

        await product.update({ category_id, name, price, description, stock_quantity, discount });

        if(req.file?.path) {
            const file_url = await cloudinary.uploader.upload(req.file.path);
            await product.update({ product_image: file_url.secure_url });
        }

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function getProducts(req, res) {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(404).send("page must be greater or equal 1");

        const limit = req.query.limit ? +req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy ? req.query.orderBy : null;
        const orderType = req.query.orderType === "asc" || req.query.orderType === "desc" ? req.query.orderType : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        const sortableColumns = [
            "name",
            "price",
            "description",
            "discount",
            "stock_quantity",
            "created_at"
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        if (orderBy === "shop") {
            order.splice(0, 0, [
                { model: Shop, as: "shop" },
                "name",
                orderType
            ]);
        }

        if (orderBy === "category") {
            order.splice(0, 0, [
                { model: Category, as: "category" },
                "name",
                orderType
            ]);
        }

        const filterOptions = { shop_id: req.user.id };

        const products = await Product.findAll({
            where: filterOptions,
            offset,
            limit,
            order,
            include: [
                {
                    model: Shop,
                    as: 'shop'
                },
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });

        const totalProducts = await Product.count();

        const data = {
            products,
            metaData: {
                page: page + 1,
                limit: limit,
                total: totalProducts,
                start: limit * page + 1,
                end: offset + limit > totalProducts ? totalProducts : offset + limit,
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
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(404).send("page must be greater or equal 1");

        const limit = req.query.limit ? +req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy ? req.query.orderBy : null;
        const orderType = req.query.orderType === "asc" || req.query.orderType === "desc" ? req.query.orderType : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        const sortableColumns = [
            "status",
            "delivery_status",
            "shipped_date",
            "created_at"
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        if (orderBy === "order_products") {
            order.splice(0, 0, [
                { model: OrderProduct, as: "order_products" },
                "quantity",
                orderType
            ]);
            order.splice(1, 0, [
                { model: OrderProduct, as: "order_products" },
                "price",
                orderType
            ]);
            order.splice(2, 0, [
                { model: OrderProduct, as: "order_products" },
                "discount",
                orderType
            ]);
        }

        // const filterOptions = { shop_id: req.user.id };

        const orders = await Order.findAll({
            offset,
            limit,
            order,
            // where: {
            //     '$order_products.product.shop_id$': req.user.id
            //     // sequelize.col("order_products.product.shop_id"): req.user.id
            // },
            include: [
                {
                    model: OrderProduct,
                    as: 'order_products',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            where: {
                                shop_id: req.user.id
                            }
                        }
                    ]
                }
            ]
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
        const { id } = req.params;

        const order = await Order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: OrderProduct,
                    as: 'order_products',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            where: {
                                shop_id: req.user.id
                            }
                        }
                    ]
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
