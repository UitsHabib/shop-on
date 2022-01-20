const { object, string, array } = require("yup");

const types = ['custom', 'standard']

const profileCreateSchema = object().shape({
    title: string()
        .min(3, "Profile title must be at least 3 characters.")
        .max(50, "Profile title must be at most 255 characters long.")
        .required("Profile title is required."),
    type: array(
        string().oneOf(Object.values(types)).required()
    )
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long.")
        .required("Description is required.")
});

const profileUpdateSchema = object().shape({
    title: string()
        .min(3, "Profile title must be at least 3 characters.")
        .max(50, "Profile title must be at most 255 characters long."),
    type: array(string().oneOf(Object.values(types)))
        .ensure(),
    description: string().max(500, "Description must be at most 500 characters long.")
});

module.exports.profileCreateSchema = profileCreateSchema;
module.exports.profileUpdateSchema = profileUpdateSchema;
