const path = require("path");
const controller = require("./customer.controller");
const { AuthStrategy } = require("./customer-authentication.middleware");
const validate = require(path.join(process.cwd(), "src/modules/core/middlewares/validate"));
const { customerRegisterSchema, customerUpdateSchema } = require("./customer.schema");
const multer = require('../../config/lib/multer');

module.exports = (app) => {
    app.post('/api/customers/login', controller.login);

    app.get('/api/customers/logout', AuthStrategy, controller.logout);

    app.route('/api/customers')
        .post(validate(customerRegisterSchema), controller.registerCustomer);

    app.route('/api/customers/profile')
        .get(AuthStrategy, controller.getSignedInCustomerProfile)
        .put(AuthStrategy, validate(customerUpdateSchema), multer.single('image'), controller.updateSignedInCustomerProfile);

    app.route('/api/customers/orders')
        .get(AuthStrategy, controller.getOrders)
        .post(AuthStrategy, controller.createOrder);

    app.route('/api/customers/orders/:id')
        .get(AuthStrategy, controller.getOrder);

    app.route('/api/customers/carts')
        .get(AuthStrategy, controller.getCart)
        .post(AuthStrategy, controller.addToCart);
};

