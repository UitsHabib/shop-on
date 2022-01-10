const controller = require('./shop.controller');

module.exports = app => {
    app
        .route('/api/shops')
        .get(controller.getShops)
        .post(controller.createShop);

    app
        .route('/api/shops/:id')
        .get(controller.getShop)
        .put(controller.updateShop)
        .patch(controller.updateShopPartial)
        .delete(controller.deleteShop);
}