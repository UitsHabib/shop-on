const path = require("path");
const multer = require("../../config/lib/multer");
const { AuthStrategy } = require("./shop-authentication.middleware");
const controller = require("./shop.controllers");
const { shopRegisterSchema, shopUpdateSchema, validateFile } = require("./shop.schema");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));


module.exports = (app) => {
    app.post('/api/shops/login', controller.login);

    app.get('/api/shops/logout', controller.logout);

    app.route('/api/shops')
        .post(validate(shopRegisterSchema), controller.registerShop);

    app.route('/api/shops/:id')
        .get(AuthStrategy, controller.getShop)
        .put(AuthStrategy, validateFile(multer.single('shop_profile_image')), validate(shopRegisterSchema), controller.updateShop)
        .patch(AuthStrategy, validateFile(multer.single('shop_profile_image')), validate(shopUpdateSchema), controller.updateShopInfo)
        .delete(AuthStrategy, controller.deleteShop);

    app.get("/api/shops/:id/products", AuthStrategy, controller.getShopProducts);

    app.get("/api/shops/:id/products/:productId", AuthStrategy, controller.getShopProduct);
}
