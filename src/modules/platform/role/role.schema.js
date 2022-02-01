const { object, string, array } = require("yup");

const types = ['custom', 'standard'];

const roleCreateSchema = object().shape({
    title: string()
        .min(3, "Role title must be at least 3 characters.")
        .max(50, "Role title must be at most 255 characters long.")
        .required("Role title is required."),
    type: string()
        .oneOf(Object.values(types))
        .required('Type is a required.')
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long.")
        .required("Description is required."),
    permissions: array().
        min(1, 'At least one permission is required.')
});

const roleUpdateSchema = object().shape({
    title: string()
        .min(3, "Role title must be at least 3 characters.")
        .max(50, "Role title must be at most 255 characters long."),
    type: string()
        .oneOf(Object.values(types))
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long."),
    permissions: array()
});

module.exports.roleCreateSchema = roleCreateSchema;
module.exports.roleUpdateSchema = roleUpdateSchema;
