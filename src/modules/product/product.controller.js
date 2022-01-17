const Shop = require("../shop/shop.model");
const Product = require("./product.model");


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
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
};

async function getProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id
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
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error.");
    }
};

async function addProduct(req, res) {
    try {
        const { product_name, price, description, category, quantity } = req.body;

        const product = await Product.create({
            product_name,
            price,
            description,
            category,
            quantity,
            shop_id: req.user.id
        });

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error.");
    }
};

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { product_name, price, description, category } = req.body;

        const product = await Product.findOne({
            where: {
                id
            }
        });
        if (!product) return res.status(404).send('Product not found.');

        if (product.shop_id !== req.user.id) return res.status(403).send('Access denied.');

        await product.update({
            product_name,
            price,
            description,
            category,
            product_profile_image: JSON.stringify(req.file)
        }
        );

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function updateProductInfo(req, res) {
    try {
        const { id } = req.params;
        const { product_name, price, description, category } = req.body;

        const product = await Product.findOne({
            where: {
                id,
            },
        });
        if (!product) return res.status(404).send("Product not found!");

        if (product.shop_id !== req.user.id) return res.status(403).send('Access denied.');

        if (product_name) product.update({ product_name });
        if (price) product.update({ price });
        if (description) product.update({ description });
        if (category) product.update({ category });
        if (req.file) await product.update({ product_profile_image: JSON.stringify(req.file) });

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id
            }
        });
        if (!product) return res.status(404).send("Product not found.");

        if (product.shop_id !== req.user.id) return res.status(403).send('Access denied.');

        await product.destroy();

        res.status(200).send(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
};


module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.updateProductInfo = updateProductInfo;
module.exports.deleteProduct = deleteProduct;
