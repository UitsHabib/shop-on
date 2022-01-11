const { object, string } = require('yup');

const shopCreateSchema = object().shape({
    shop_name: string()
        .required('Shop name is required.'),
    password: string()
        .min(8, 'The password must be at least 8 characters long.')
        .max(50, 'The password must be at most 50 characters long.')
        .required('Password is required.'),
    description: string()
        .required('Description is required.'),
    registration_number: string()
        .required('Registration number is required.')
});

const shopUpdateSchema = object().shape({
    shop_name: string(),
    password: string()
        .min(8, 'The password must be at least 8 characters long.')
        .max(50, 'The password must be at most 50 characters long.'),
    description: string(),
    registration_number: string()
});

module.exports.shopCreateSchema = shopCreateSchema;
module.exports.shopUpdateSchema = shopUpdateSchema;