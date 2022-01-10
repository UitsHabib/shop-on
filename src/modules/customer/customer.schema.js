const { object, string } = require("yup");

const customerUploadSchema = object().shape({
  name: string()
    .min(3, "Customer name must be at least 3 characters.")
    .max(255, "Customer name must be at most 255 characters long.")
    .required("Customer name is required."),
  address: string().max(
    2000,
    "Address must be at most 2000 characters long."
  ),
  phone_number: string()
    .min(11, "Phone number must be at most 11 characters long.")
    .max(11, "Phone number must be at most 11 characters long.")
    .required("Phone number is required."),
});

module.exports.customerUploadSchema = customerUploadSchema;
module.exports.customerUpdateSchema = customerUploadSchema;
