const { object, string } = require("yup");

const subCategorySchema = object().shape({
    sub_category: string()
        .required('Sub Category is required.')
});

module.exports.subCategorySchema = subCategorySchema;