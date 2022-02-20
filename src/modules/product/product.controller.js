const path = require("path");
const Shop = require("../shop/shop.model");
const Product = require("./product.model");
const Category = require("./category.model");

const { getPagination, getPagingData } = require("./services/product.service");
const cloudinary = require(path.join(process.cwd(), 'src/config/lib/cloudinary'));


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
            product_image: req.file.filename,
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
        const file_url = await cloudinary.uploader.upload(req.file.path);

        const product = await Product.findOne({
            where: {
                id
            }
        });
        if (!product) return res.status(404).send('Product not found.');

        await product.update({
            product_name,
            price,
            description,
            category,
            product_profile_image: file_url.secure_url
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
        const file_url = req.file && await cloudinary.uploader.upload(req.file.path);

        const product = await Product.findOne({
            where: {
                id,
            },
        });
        if (!product) return res.status(404).send("Product not found!");

        if (name) product.update({ name });
        if (req.file) product.update({ product_image: req.file.filename });
        if (product_name) product.update({ product_name });
        if (price) product.update({ price });
        if (description) product.update({ description });
        if (category) product.update({ category });
        if (file_url) await product.update({ product_profile_image: file_url.secure_url });

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

        await product.destroy();

        res.status(200).send(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error.");
    }
};

async function getCategories(req, res) {
    try {
        const { page, offset, limit, order } = getPagination(req);

        const products = await Category.findAll({
            offset,
            limit,
            order
        });

        const total = await Category.count();

        const data = getPagingData(total, page, offset, limit, products);

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function addCategory(req, res) {
    try {
        const { shop_id, name, description } = req.body;

        const product = await Product.findOne({
            where: {
                id,
            },
        });

        if (!product) return res.status(404).send("Product not found!");

        const category = await Category.create({
            shop_id,
            name,
            description
        });

        res.status(201).send(category);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
module.exports.getCategories = getCategories;
module.exports.addCategory = addCategory;
module.exports.updateProductInfo = updateProductInfo;
module.exports.deleteProduct = deleteProduct;
