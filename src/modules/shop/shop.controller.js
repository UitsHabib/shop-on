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
        const { name, registrationNumber, userId } = req.body;

        const shop = await Shop.create({
            name,
            registration_number: registrationNumber,
            user_id: userId
        });

        res.status(201).send(shop);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

async function updateShop(req, res) {
    try {
        const { id } = req.params;
        const { name, registrationNumber, userId } = req.body;

        let shop = await Shop.findOne({
            where: {
                id
            }
        });

        shop = shop.update({
            name: name,
            registration_number: registrationNumber,
            user_id: userId
        });

        if (!shop) return res.status(404).send("Shop not found!");

        res.status(201).send(shop);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

async function updateShopPartial(req, res) {
    try {
        const { id } = req.params;
        const { name, registrationNumber, userId } = req.body;

        const shop = await Shop.findOne({
            where: {
                id
            }
        });

        if (!shop) return res.status(404).send("Shop not found!");

        if (name) shop.update({ name });
        if (registrationNumber) shop.update({ registration_number: registrationNumber });
        if (userId) shop.update({ user_id: userId });

        res.status(201).send(shop);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

async function deleteShop(req, res) {
    try {
        const { id } = req.params;
        const shop = await Shop.findOne({
            where: {
                id
            }
        });

        if (!shop) return res.status(404).send("Shop not found!");

        await shop.destroy();

        res.status(200).send(shop);

    }
    catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error!');
    }
}

module.exports.getShops = getShops;
module.exports.getShop = getShop;
module.exports.createShop = createShop;
module.exports.updateShop = updateShop;
module.exports.updateShopPartial = updateShopPartial;
module.exports.deleteShop = deleteShop;