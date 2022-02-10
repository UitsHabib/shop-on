const path = require('path');
const Cart = require('./cart.model');
const User = require(path.join(process.cwd(), "src/modules/user/user.model"))
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"))
const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: {
        user_id
      }
    });
    if (cart === null) res.send([])

    const cartDetails = cart.dataValues;

    const quantities = [];

    const productId = cartDetails.cart_items.map(item => {
      quantities.push(item.qty);
      return item.product_id;
    });

    let products = await Products.findAll({
      where: { product_id: productId }
    });

    let arrayOfObjects = [];
    products.forEach((item, index) => {
      let obj = { ...item };
      obj["qty"] = quantities[index];
      arrayOfObjects.push(obj);
    });

    res.send(arrayOfObjects);

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};


module.exports.getAllCart = getAllCart;