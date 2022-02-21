const Category = require("./category.model");
const SubCategory = require("./sub-category.model");


async function getCategories(req, res) {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 15;
        const offset = (page - 1) * limit;
        let { orderBy, orderType } = req.query;
        orderType = orderType || 'asc';
        let order = [['created_at', 'desc']];

        if (orderBy) {
            order.push([orderBy, orderType]);
        }

        const categories = await Category.findAll({ offset, limit, order });

        const total = await Category.count();

        const data = {
            categories,
            meta: {
                start: offset + 1,
                end: Math.min(total, page * limit),
                total,
                page
            }
        };

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function createCategory(req, res) {
    try {
        const { category } = req.body;

        const existCategory = await Category.findOne({
            where: {
                category
            }
        });
        if (existCategory) return res.status(400).send('Duplicate category.');

        const newCategory = await Category.create({
            category,
            shop_id: req.user.id
        });

        res.status(201).send(newCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findOne({
            where: {
                id
            }
        });
        if (!category) return res.status(404).send('Category not found.');

        res.status(200).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const { category } = req.body;

        const existCategory = await Category.findOne({
            where: {
                id
            }
        });
        if (!existCategory) return res.status(404).send('Category not found.');

        await existCategory.update({
            category
        });

        res.status(201).send(existCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await Category.findOne({
            where: {
                id
            }
        });
        if (!category) return res.status(404).send('Category not found.');

        await category.destroy();

        res.status(200).send(category);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}


async function getSubCategories(req, res) {
    try {
        const { id } = req.params;

        const existCategory = await Category.findOne({
            where: {
                id
            }
        });
        if (!existCategory) return res.status(404).send('Category not found.');

        const page = +req.query.page || 1;
        const limit = +req.query.limit || 15;
        const offset = (page - 1) * limit;
        let { orderBy, orderType } = req.query;
        orderType = orderType || 'asc';
        let order = [['created_at', 'desc']];

        if (orderBy) {
            order.push([orderBy, orderType]);
        }

        const subCategories = await SubCategory.findAll({
            where: {
                category_id: id
            },
            include: [
                {
                    model: Category,
                    as: 'categories'
                }
            ],
            offset,
            limit,
            order
         });

        const total = await SubCategory.count();

        const data = {
            subCategories,
            meta: {
                start: offset + 1,
                end: Math.min(total, page * limit),
                total,
                page
            }
        };

        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function createSubCategory(req, res) {
    try {
        const { id } = req.params;
        const { sub_category } = req.body;

        const existCategory = await Category.findOne({
            where: {
                id
            }
        });
        if (!existCategory) return res.status(404).send('Category not found.');

        const existSubCategory = await SubCategory.findOne({
            where: {
                sub_category
            }
        });
        if (existSubCategory) return res.status(400).send('Duplicate sub category.');

        const subCategory = await SubCategory.create({
            sub_category,
            category_id: id
        });

        res.status(201).send(subCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function getSubCategory(req, res) {
    try {
        const { id, subCategoryId } = req.params;

        const existCategory = await Category.findOne({
            where: {
                id
            }
        });
        if (!existCategory) return res.status(404).send('Category not found.');

        const subCategory = await SubCategory.findOne({
            where: {
                id: subCategoryId,
                category_id: id
            },
            include: [
                {
                    model: Category,
                    as: 'categories'
                }
            ]
        });
        if (!subCategory) return res.status(404).send('SubCategory not found.');

        res.status(200).send(subCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function updateSubCategory(req, res) {
    try {
        const { id, subCategoryId } = req.params;
        const { sub_category } = req.body;

        const existCategory = await Category.findOne({
            where: {
                id
            }
        });
        if (!existCategory) return res.status(404).send('Category not found.');

        const subCategory = await SubCategory.findOne({
            where: {
                id: subCategoryId,
                category_id: id
            },
            include: [
                {
                    model: Category,
                    as: 'categories'
                }
            ]
        });
        if (!subCategory) return res.status(404).send('SubCategory not found.');

        await subCategory.update({
            sub_category
        });

        res.status(201).send(subCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}

async function deleteSubCategory(req, res) {
    try {
        const { id, subCategoryId } = req.params;

        const category = await Category.findOne({
            where: {
                id
            }
        });
        if (!category) return res.status(404).send('Category not found.');

        const subCategory = await SubCategory.findOne({
            where: {
                id: subCategoryId,
                category_id: id
            },
            include: [
                {
                    model: Category,
                    as: 'categories'
                }
            ]
        });
        if (!subCategory) return res.status(404).send('SubCategory not found.');

        await subCategory.destroy();

        res.status(200).send(subCategory);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error.');
    }
}


module.exports.getCategories = getCategories;
module.exports.createCategory = createCategory;
module.exports.getCategory = getCategory;
module.exports.updateCategory = updateCategory;
module.exports.deleteCategory = deleteCategory;

module.exports.getSubCategories = getSubCategories;
module.exports.createSubCategory = createSubCategory;
module.exports.getSubCategory = getSubCategory;
module.exports.updateSubCategory = updateSubCategory;
module.exports.deleteSubCategory = deleteSubCategory;