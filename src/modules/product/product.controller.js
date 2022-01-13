const Product = require("./product.model");

async function getProducts(req, res) {
    try {
        const products = await Product.findAll();

        res.status(200).send(products);
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
            }
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
            shop_id: req.data.dataValues.id
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

        await product.update({
            product_name,
            price,
            description,
            category,
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

        if (product_name) product.update({ product_name });
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

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.updateProduct = updateProduct;
module.exports.updateProductInfo = updateProductInfo;
module.exports.deleteProduct = deleteProduct;
