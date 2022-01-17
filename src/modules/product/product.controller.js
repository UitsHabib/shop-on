const Shop = require("../shop/shop.model");
const Product = require("./product.model");

async function getProducts(req, res) {
  try {
    let { page, limit } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const products = await Product.findAll({
      offset: (page - 1) * limit || 0,
      limit: limit || 5,
      include: [{
        model: Shop,
        as: 'shops'
      }]
    });

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
      },
      include: [{
        model: Shop,
        as: 'shops'
      }]
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
    if (req.user.is_active === '0') return res.status(400).send('Shop is not active.');

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
