const { object, string, number } = require("yup");

const productUploadSchema = object().shape({
    product_name: string()
        .min(3, "Product name must be at least 3 characters.")
        .max(255, "Product name must be at most 255 characters long.")
        .required("Product name is required."),
    price: number()
        .typeError('Price must be a number')
        .positive('Price must be a positive number.')
        .required("Price is required."),
    description: string()
        .max(2000, "Description must be at most 2000 characters long.")
        .required("Description is required."),
    category: string()
        .max(255, "Category must be at most 255 characters long.")
        .required("category is required."),
    quantity: number()
        .typeError('Quantity must be a number.')
        .required('Quantity is required.')
        .positive('Quantity must be a positive number.')
        .integer('Quantity must be a integer number.')
        .min(1, 'Minimum 1 product is required.'),
});

const productUpdateSchema = object().shape({
    product_name: string()
        .min(3, "Product name must be at least 3 characters.")
        .max(255, "Product name must be at most 255 characters long."),
    price: number()
        .typeError('Price must be a number')
        .positive('Price must be a positive number.'),
    description: string()
        .max(2000, "Description must be at most 2000 characters long."),
    category: string()
        .max(255, "Category must be at most 255 characters long."),
    quantity: number()
        .typeError('Quantity must be a number.')
        .positive('Quantity must be a positive number.')
        .integer('Quantity must be a integer number.')
        .min(1, 'Minimum 1 product is required.'),
});

module.exports.productUploadSchema = productUploadSchema;
module.exports.productUpdateSchema = productUpdateSchema;