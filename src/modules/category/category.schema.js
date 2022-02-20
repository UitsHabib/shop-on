const { object, string } = require("yup");

const categorySchema = object().shape({
    category: string()
        .required('Category is required.')
});

module.exports.categorySchema = categorySchema;