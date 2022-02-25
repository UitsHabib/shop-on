const path = require('path');
const Cart = require('./cart.model');
const User = require(path.join(process.cwd(), "src/modules/user/user.model"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));

const getCartByUser = async (req, res) => {
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

const addToCart = async (req, res) => {
  Cart.findOne({
    where: {
      user_id: req.body.user_id
    }
  }).then(user => {
    if (user) {
      Cart.destroy({
        where: {
          user_id: req.body.user_id
        }
      }).then(c => {
        if (req.body.cart_items.length > 0) {
          Cart.create(req.body)
            .then(res.send("Inserted in Cart Successfully"));
        } else res.send("Cart is Empty!");
      });
    } else {
      if (req.body.cart_items.length > 0) {
        Cart.create(req.body)
          .then(res.send("Inserted in Cart Successfully"));
      } else res.send("Cart is Empty!");
    }
  });
}

module.exports.getCartByUser = getCartByUser;
module.exports.addToCart = addToCart;
