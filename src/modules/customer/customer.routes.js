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

    app.route('/api/customers/:id')
        .get(AuthStrategy, controller.getCustomer)
        .put(AuthStrategy, validate(customerUpdateSchema), controller.updateCustomer)
        .patch(AuthStrategy, validate(customerUpdateSchema), controller.updateCustomerDetails)
        .delete(AuthStrategy, controller.deleteCustomer);

    app.route('/api/customers/updateAvatar/:id')
        .put(AuthStrategy, multer.single('image'), controller.updateAvatar);
};

