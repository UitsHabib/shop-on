const Product = require("./product.model");
const Formidable = require('formidable');
const multer = require('../../modules/product/product.multer');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

const getProduct = async (req, res) => {
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

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;