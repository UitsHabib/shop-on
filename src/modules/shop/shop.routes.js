const path = require("path");
const multer = require(path.join(process.cwd(), "src/config/lib/multer"));
const { AuthStrategy } = require("./shop-authentication.middleware");
const controller = require("./shop.controllers");
const { shopRegisterSchema, shopUpdateSchema } = require("./shop.schema");
const { productUploadSchema, productUpdateSchema } = require(path.join(process.cwd(), "src/modules/product/product.schema"));
const validateFile = require(path.join(process.cwd(), "src/modules/core/middlewares/validate-file"));
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));

module.exports = (app) => {
    app.post('/api/shops/login', controller.login);

    app.get('/api/shops/logout', AuthStrategy, controller.logout);

    app.post('/api/shops', validate(shopRegisterSchema), controller.registerShop);

    app.route('/api/shops/profile')
        .get(AuthStrategy, controller.getSignedInShopProfile)
        .put(AuthStrategy, validate(shopUpdateSchema), validateFile(multer.single('shop_profile_image')), controller.updateSignedInShopProfile);

    app.route("/api/shops/products")
        .get(AuthStrategy, controller.getProducts)
        .post(AuthStrategy, validate(productUploadSchema), validateFile(multer.single('product_image')), controller.addProduct);

    app.route("/api/shops/products/:id")
        .get(AuthStrategy, controller.getProduct)
        .patch(AuthStrategy, validate(productUpdateSchema), validateFile(multer.single('product_image')), controller.updateProduct)
        .delete(AuthStrategy, controller.deleteProduct);

    app.get("/api/shops/orders", AuthStrategy, controller.getOrders);

    app.get("/api/shops/orders/:id", AuthStrategy, controller.getOrder);

    app.patch("/api/shops/orders/id/accept", AuthStrategy, controller.acceptOrder);
}
