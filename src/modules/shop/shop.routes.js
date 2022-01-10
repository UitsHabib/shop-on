const path = require('path');
const controller = require('./shop.controller');
const validate = require(path.join(process.cwd(), 'src/modules/core/middlewares/validate'))
const { shopCreateSchema, shopUpdateSchema } = require('./shop.schema');

module.exports = app => {
    app
        .route('/api/shops')
        .get(controller.getShops)
        .post(validate(shopCreateSchema), controller.createShop);

    app
        .route('/api/shops/:id')
        .get(controller.getShop)
        .put(validate(shopCreateSchema), controller.updateShop)
        .patch(validate(shopUpdateSchema), controller.updateShopPartial)
        .delete(controller.deleteShop);
}