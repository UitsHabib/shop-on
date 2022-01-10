const Shop = require('./shop.model');

async function getShops(req, res) {
    try {
        const shops = await Shop.findAll();

        res.status(500).send(shops);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

async function getShop(req, res) {
    try {
        const { id } = req.params;

        const shop = await Shop.findOne({
            where: {
                id
            }
        });

        if (!shop) return res.status(404).send("Shop not found!");

        res.status(200).send(shop);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

async function createShop(req, res) {
    try {

    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

module.exports.getShops = getShops;
module.exports.getShop = getShop; 