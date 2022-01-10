const { object, string, number } = require('yup');

const shopCreateSchema = object().shape({
    name: string()
        .min(3, 'Shop name must be at least 3 characters.')
        .max(255, 'Shop name must be at most 255 characters long.')
        .required('Shop name is required.'),
    registrationNumber: string()
        // .min(3, 'Shop registration number must be at least 3 characters.')
        .max(255, 'Shop registration number must be at most 255 characters long.')
        .required('Shop registration number is required.'),
    userId: number()
        .max(255, 'Shop user id must be at most 255 characters long.')
        .required('Shop user id is required.')
});

const shopUpdateSchema = object().shape({
    name: string()
        .min(3, 'Shop name must be at least 3 characters.')
        .max(255, 'Shop name must be at most 255 characters long.'),
    registrationNumber: string()
        // .min(3, 'Shop registration number must be at least 3 characters.')
        .max(255, 'Shop registration number must be at most 255 characters long.'),
    userId: number()
        .max(255, 'Shop user id must be at most 255 characters long.')
});

module.exports.shopCreateSchema = shopCreateSchema;
module.exports.shopUpdateSchema = shopUpdateSchema;