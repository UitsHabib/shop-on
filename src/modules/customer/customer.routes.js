const path = require("path");
const controller = require("./customer.controller");
const validate = require(path.join(
  process.cwd(),
  "src/modules/core/middlewares/validate"
));
const {
  customerUploadSchema,
  customerUpdateSchema,
} = require("./customer.schema");

module.exports = (app) => {
  app
    .route("/api/customers")
    .get(controller.getCustomers)
    .post(validate(customerUploadSchema), controller.addCustomer);

  app
    .route("/api/customers/:id")
    .get(controller.getCustomer)
    .put(validate(customerUploadSchema), controller.putCustomer)
    .patch(validate(customerUpdateSchema), controller.patchCustomer)
    .delete(controller.deleteCustomer);
};
