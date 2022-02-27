const path = require("path");
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const Shop = require(path.join(process.cwd(), "src/modules/shop/shop.model"));

async function getProducts(req, res) {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(400).send("page must be greater or equal 1");

        const limit = req.query.limit ? +req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy ? req.query.orderBy : null;
        const orderType = req.query.orderType === "asc" || req.query.orderType === "desc" ? req.query.orderType : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        const sortableColumns = [
            "name",
            "price",
            "description",
            "discount",
            "stock_quantity",
            "created_at"
        ];

        if (orderBy && sortableColumns.includes(orderBy)) {
            order.splice(0, 0, [orderBy, orderType]);
        }

        if (orderBy === "shop") {
            order.splice(0, 0, [
                { model: Shop, as: "shop" },
                "name",
                orderType
            ]);

        }

        if (orderBy === "category") {
            order.splice(0, 0, [
                { model: Category, as: "category" },
                "name",
                orderType
            ]);
        }

        // const filterOptions = { id: { [Op.ne]: req.user.id } };

        const products = await Product.findAll({
            offset,
            limit,
            order,
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ]
        });

        const totalProducts = await Product.count();

        const data = {
            products,
            metaData: {
                page: page + 1,
                limit: limit,
                total: totalProducts,
                start: limit * page + 1,
                end: offset + limit > totalProducts ? totalProducts : offset + limit,
            }
        };

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
};

async function getProduct(req, res) {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Shop,
                    as: 'shops'
                }
            ]
        });

        if (!product) return res.status(404).send("Product not found.");

        res.status(200).send(product);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error.");
    }
};

async function getCategories(req, res) {
    try {
        const { page, offset, limit, order } = getPagination(req);

        const products = await Category.findAll({
            offset,
            limit,
            order
        });

        const total = await Category.count();

        const data = getPagingData(total, page, offset, limit, products);

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function addCategory(req, res) {
    try {
        const { shop_id, name, description } = req.body;

        const product = await Product.findOne({
            where: {
                id,
            },
        });

        if (!product) return res.status(404).send("Product not found!");

        const category = await Category.create({
            shop_id,
            name,
            description
        });

        res.status(201).send(category);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCategories = getCategories;
module.exports.addCategory = addCategory;
