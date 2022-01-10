const controller = require('./shop.controller');

module.exports = app => {
    app
        .route('/api/shops')
        .get(controller.getShops)
        .post(controller.createShop);

    app
        .route('/api/shops/:id')
        .get(controller.getShop)
}