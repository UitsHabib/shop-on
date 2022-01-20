const { object, string, number } = require("yup");

const productUploadSchema = object().shape({
    name: string()
        .min(3, "Product name must be at least 3 characters.")
        .max(255, "Product name must be at most 255 characters long.")
        .required("Product name is required."),
    price: number().required("Price is required."),
    description: string().max(
        2000,
        "Description must be at most 2000 characters long."
    ),
    category: string()
        .max(255, "Category must be at most 255 characters long.")
        .required("category is required."),
});

const productUpdateSchema = object().shape({
    name: string()
        .min(3, "Product name must be at least 3 characters")
        .max(255, "Product name must be at most 255 characters long."),
    price: number(),
    description: string().max(
        2000,
        "Description must be at most 2000 characters long."
    ),
    category: string().max(255, "Category must be at most 255 characters long."),
});

module.exports.productUploadSchema = productUploadSchema;
module.exports.productUpdateSchema = productUpdateSchema;
