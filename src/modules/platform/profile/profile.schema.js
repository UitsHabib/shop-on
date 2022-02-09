const { object, string, array } = require("yup");

const types = ['custom', 'standard'];

const profileCreateSchema = object().shape({
    title: string()
        .min(3, "Profile title must be at least 3 characters.")
        .max(50, "Profile title must be at most 255 characters long.")
        .required("Profile title is required."),
    type: string()
        .oneOf(Object.values(types)),
    description: string().max(500, "Description must be at most 500 characters long.")
        .required("Description is required."),
    permissions: array()
        .min(1, 'At least one permission is required.')
});

const profileUpdateSchema = object().shape({
    title: string()
        .min(3, "Profile title must be at least 3 characters.")
        .max(50, "Profile title must be at most 255 characters long."),
    type: string()
        .oneOf(Object.values(types)),
    description: string().max(500, "Description must be at most 500 characters long."),
    permissions: array()
});

module.exports.profileCreateSchema = profileCreateSchema;
module.exports.profileUpdateSchema = profileUpdateSchema;
