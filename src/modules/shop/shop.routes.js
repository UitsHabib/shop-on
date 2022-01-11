const path = require("path");
const { AuthStrategy } = require("./shop-authentication.middleware");
const controller = require("./shop.controllers");
const { shopCreateSchema, shopUpdateSchema } = require("./shop.schema");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.route('/api/shops')
        .get(controller.getShops)
        .post(validate(shopCreateSchema), controller.createShop);

    app.route('/api/shops/:id')
        .get(controller.getShop)
        .put(AuthStrategy, validate(shopCreateSchema), controller.updateShop)
        .patch(AuthStrategy, validate(shopUpdateSchema), controller.updateShopInfo)
        .delete(AuthStrategy, controller.deleteShop);

    app.post('/api/login', controller.login);

    app.get('/api/logout', controller.logout);

    app.get("/api/shops/:id/products", controller.getShopAllProduct);

    app.get("/api/shops/:id/products/:productId", controller.getShopSingleProduct);
}
