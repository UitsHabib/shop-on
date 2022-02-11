const path = require("path");
const multer = require(path.join(process.cwd(), "src/config/lib/multer"));
const { AuthStrategy } = require("./shop-authentication.middleware");
const controller = require("./shop.controllers");
const { shopRegisterSchema, shopUpdateSchema, validateFile } = require("./shop.schema");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));


module.exports = (app) => {
    app.post('/api/shops/login', controller.login);

    app.get('/api/shops/logout', controller.logout);

    app.post('/api/shops', validate(shopRegisterSchema), controller.registerShop);

    app.route('/api/shops/:id')
        .get(AuthStrategy, controller.getShop)
        .put(AuthStrategy, validateFile(multer.single('shop_profile_image')), validate(shopRegisterSchema), controller.updateShop)
        .patch(AuthStrategy, validateFile(multer.single('shop_profile_image')), validate(shopUpdateSchema), controller.updateShopInfo)
        .delete(AuthStrategy, controller.deleteShop);

    app.route("/api/shops/:id/products")
        .get(AuthStrategy, controller.getShopProducts)
        .delete(AuthStrategy, controller.deleteShopProducts);

    app.route("/api/shops/:id/products/:productId")
        .get(AuthStrategy, controller.getShopProduct)
        .delete(AuthStrategy, controller.deleteShopProduct);

    app.get("/api/shops/:id/orders", AuthStrategy, controller.getShopOrders);

    app.get("/api/shops/:id/orders/:orderId", AuthStrategy, controller.getShopOrder);

    app.patch("/api/shops/:id/orders/:orderId/accept-order", AuthStrategy, controller.acceptOrder);
}
