const { object, string, ref } = require('yup');

const isEmailLengthValid = email => {
    if (!email) return false;
    const part = email.split('@');
    const emailParts = part[0];
    return emailParts.length <= 64;
}

const userRegisterSchema = object().shape({
    username: string()
        .min(3, 'Username must be at least 3 characters.')
        .max(50, 'Username must be at most 50 character long.')
        .required('Username is required.'),
    email: string()
        .email('This field should be a valid email address.')
        .max(100, 'Email must be at most 100 characters long.')
        .required('Email is required.')
        .test('is-valid-email-length', 'The part before @ of the email can be maximum 64 characters.',
            email => isEmailLengthValid(email)),
    password: string()
        .min(8, 'The password must be at least 8 characters long.')
        .max(50, 'The password must be at most 50 characters long.')
        .required('Password is required.'),
    confirm_password: string()
        .required('Confirm Password is required')
        .oneOf([ref('password'), null], 'Password and Confirm Password must should be matched')
});

const userUpdateSchema = object().shape({
    username: string()
        .min(3, 'Username must be at least 3 characters.')
        .max(50, 'Username must be at most 50 characters long.'),
    email: string()
        .email('This field should be a valid email address.')
        .max(100, 'Email must be at most 100 characters long.')
        .test('is-valid-email-length', 'The part before @ of the email can be maximum 64 characters.',
            email => isEmailLengthValid(email))
});

module.exports.userRegisterSchema = userRegisterSchema;
module.exports.userUpdateSchema = userUpdateSchema;