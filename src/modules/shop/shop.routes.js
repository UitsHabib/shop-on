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

    app.route('/api/shops/profile')
        .get(AuthStrategy, controller.getSignedInShopProfile)
        .put(AuthStrategy, validate(shopUpdateSchema), validateFile(multer.single('shop_profile_image')), controller.updateSignedInShopProfile);

    app.route("/api/shops/products")
        .get(AuthStrategy, controller.getProducts)

    app.route("/api/shops/products/:id")
        .get(AuthStrategy, controller.getProduct)
        .delete(AuthStrategy, controller.deleteProduct);

    app.get("/api/shops/orders", AuthStrategy, controller.getOrders);

    app.get("/api/shops/orders/:id", AuthStrategy, controller.getOrder);

    app.patch("/api/shops/orders/id/accept", AuthStrategy, controller.acceptOrder);
}
