const path = require("path");
const Order = require(path.join(process.cwd(), "src/modules/order/order.model"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const OrderProduct = require(path.join(process.cwd(), "src/modules/order/order-product.model"));

const orderAttributes = [
    "customer_id", 
    "total_price",
    "staus",
    "delivery_status",
    "created_by",
    "updated_by"
]

const getOrders = async (req, res) => { 
    try {
        const orders = await Order.findAll({
            attributes: orderAttributes,
            include: [
                {
                    model: OrderProduct,
                    as: "order-product",
                    attributes: ["id"],                    
                    include:[
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "name", "price", "shop-id"]
                        }                       
                    ]
                }
            ]
        });

        res.status(200).send(orders);
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    } 
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await order.findOne({
            where: {
                id
            },
            include: [
                {
                    model: OrderProduct,
                    as: "order-product",
                    attributes: ["id"],                    
                    include:[
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "name", "price", "shop-id"]
                        }                       
                    ]
                }
            ]
        });

        if (!order) return res.status(404).send('Order not found!');

        res.status(200).send(role);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal server error!');
    }
};

const createOrder = async (req, res) => {
    
};

const updateOrder = async (req, res) => {
    try {
        const { order_id, status, delivery_status, shipped_date } = req.body;

        const order = await Order.findOne({ where: { id: order_id }});

        if (!order) return res.status(404).send("Order not found!");

        if (status) await order.update({ status });
        if (delivery_status) order.update({ delivery_status });
        if (shipped_date) order.update({ shipped_date });
        
        res.status(200).send(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            where: {
                id,
            },
        });

        if (!order) return res.status(404).send("Order not found!");

        await order.destroy();

        res.status(200).send(order);

    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    } 
};

module.exports.getOrders = getOrders;
module.exports.getOrder = getOrder;
module.exports.createOrder = createOrder;
module.exports.updateOrder = updateOrder;
module.exports.deleteOrder = deleteOrder;