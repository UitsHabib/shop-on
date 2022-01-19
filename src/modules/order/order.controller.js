const OrderModel = require("./order.model");

const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.findAll();

    res.status(200).send(orders);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error!");
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const { product_id } = req.params;

    const order = await OrderModel.findOne({
      where: {
        product_id,
      },
    });
    if (!order) return res.status(404).send("order not found!");

    res.status(200).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};


const createOrder = async (req, res) => {
  try {
    const { id } = req.body;

    const order = await OrderModel.create({
      id
    });

    res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await order.update(

      {
        where: {
          id,
          quantity
        },
      }
    );

    if (!order) return res.status(404).send("order not found!");

    res.status(201).send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error!");
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  const order = await order.findOne({
    where: {
      id,
    },
  });

  if (!order) return res.status(404).send("order not found!");

  await order.destroy();

  res.sendStatus(201).send(order);
};



module.exports.getAllOrders = getAllOrders;
module.exports.getOrderByUser = getOrderByUser;
module.exports.createOrder = createOrder;
module.exports.updateOrder = updateOrder;
module.exports.deleteOrder = deleteOrder;
