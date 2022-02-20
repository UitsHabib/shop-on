const { object, string, ref, boolean } = require('yup');
const multer = require("multer");

const shopRegisterSchema = object().shape({
    name: string()
        .required('Name is required.'),
    email: string()
        .required('Email is required.')
        .email('Must be a valid email address.')
        .max(100, 'Email not more than 100 characters long.')
        .test(
            'is-valid-email-length',
            'Before @ the email not more than 100 characters long.',
            email => !email || email.split('@')[0].length <= 100
        ),
    password: string()
        .required('Password is required.')
        .min(8, 'Password must be at least 8 characters long.')
        .max(255, 'Password not more than 255 characters long.')
        .matches(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
            'Password must include at least one uppercase, lowercase, number and special character.'
        ),
    confirm_password: string()
        .required('Confirm password is required.')
        .oneOf([ref('password'), null], 'Passwords must match.'),
    description: string(),
    license_number: string()
        .required('License number is required.'),
    is_active: boolean('Must be boolean.'),
});

const shopUpdateSchema = object().shape({
    shop_name: string(),
    email: string()
        .email('Must be a valid email address.')
        .max(255, 'Email not more than 255 characters long.')
        .test(
            'is-valid-email-length',
            'Before @ the email not more than 100 characters long.',
            email => !email || email.split('@')[0].length <= 100
        ),
    password: string()
        .min(8, 'Password must be at least 8 characters long.')
        .max(255, 'Password not more than 255 characters long.')
        .matches(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
            'Password must include at least one uppercase, lowercase, number and special character.'
        ),
    confirm_password: string()
        .oneOf(
            [ref('password')],
            'Passwords must match.'
        ),
    description: string(),
    license_number: string(),
    is_active: boolean('Must be boolean.')
});

function validateFile(upload) {
    return function (req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) return res.status(400).send(err);
            else if (err) return res.status(400).send(err);

            next();
        });
    }
}

module.exports.shopRegisterSchema = shopRegisterSchema;
module.exports.shopUpdateSchema = shopUpdateSchema;
module.exports.validateFile = validateFile;