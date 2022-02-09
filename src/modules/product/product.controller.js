const Product = require("./product.model");
const { getPagination, getPagingData } = require("./services/product.service");

async function getProducts(req, res) {
    try {
        const { page, offset, limit, order } = getPagination(req);

        const products = await Product.findAll({
            offset,
            limit,
            order
        });

        const total = await Product.count();

        const data = getPagingData(total, page, offset, limit, products);

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function getProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id,
            },
        });
        if (!product) return res.status(404).send("Product not found!");

        res.status(200).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function addProduct(req, res) {
    try {
        const { name, price, description, category } = req.body;

        const product = await Product.create({
            name,
            price,
            description,
            category,
        });

        res.status(201).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description, category } = req.body;

        const product = await Product.findOne({
            where: {
                id,
            },
        });

        if (!product) return res.status(404).send("Product not found!");

        if (name) product.update({ name });
        if (price) product.update({ price });
        if (description) product.update({ description });
        if (category) product.update({ category });

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
                id,
            },
        });

        if (!product) return res.status(404).send("Product not found!");

        await product.destroy();

        res.status(201).send(product);
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;