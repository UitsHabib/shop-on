const { object, string, array } = require("yup");

const types = ['custom', 'standard'];

const permissionCreateSchema = object().shape({
    title: string()
        .min(3, "Permission title must be at least 3 characters.")
        .max(50, "Permission title must be at most 255 characters long.")
        .required("Permission title is required."),
    type: string()
        .oneOf(Object.values(types))
        .required('Type is a required.')
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long.")
        .required("Description is required."),
    services: array().
        min(1, 'At least one permission service is required.')
});

const permissionUpdateSchema = object().shape({
    title: string()
        .min(3, "Permission title must be at least 3 characters.")
        .max(50, "Permission title must be at most 255 characters long."),
    type: string()
        .oneOf(Object.values(types))
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long."),
    services: array()
});

module.exports.permissionCreateSchema = permissionCreateSchema;
module.exports.permissionUpdateSchema = permissionUpdateSchema;
