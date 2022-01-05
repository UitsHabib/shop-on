const Product = require("./product.model");

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

const addProduct = async (req, res) => {
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

const putProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;

    const product = await Product.update(
      {
        name,
        price,
        description,
        category,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!product) return res.status(404).send("Product not found!");

    res.status(201).send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const patchProduct = async (req, res) => {
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

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: {
      id,
    },
  });

  if (!product) return res.status(404).send("Product not found!");

  await product.destroy();

  res.sendStatus(201).send(product);
};

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.addProduct = addProduct;
module.exports.putProduct = putProduct;
module.exports.patchProduct = patchProduct;
module.exports.deleteProduct = deleteProduct;
