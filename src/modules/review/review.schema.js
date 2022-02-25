const { object, string, number } = require('yup');

const reviewSchema = object().shape({
    customer_id: number()
        .required('Customer_id is required.'),
    product_id: number()
        .required('Product_id is required.'),
    rating: number()
        .typeError('you must specify a number')
        .min(0, 'Min value 0.')
        .max(5, 'Max value 5.'),
    description: string()
        .min(10, 'The description must be at least 10 characters long.')
        .max(500, 'The description must be at most 500 characters long.')
        .required('Description is required.'),

});

module.exports.reviewSchema = reviewSchema;