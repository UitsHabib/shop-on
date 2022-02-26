const path = require("path");
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));
const Shop = require(path.join(process.cwd(), "src/modules/shop/shop.model"));

async function getProducts(req, res) {
    try {
        const page = req.query.page ? req.query.page - 1 : 0;
        if (page < 0) return res.status(404).send("page must be greater or equal 1");

        const limit = req.query.limit ? +req.query.limit : 15;
        const offset = page * limit;

        const orderBy = req.query.orderBy ? req.query.orderBy : null;
        const orderType = req.query.orderType === "asc" || req.query.orderType === "desc" ? req.query.orderType : "asc";

        const order = [
            ["created_at", "DESC"],
            ["id", "DESC"]
        ];

        if (orderBy) {
            order.push([orderBy, orderType]);
        }

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
            meta: {
                metaData: {
                    page: page + 1,
                    limit: limit,
                    total: totalProducts,
                    start: limit * page + 1,
                    end: offset + limit > totalProducts ? totalProducts : offset + limit,
                }
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
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                id
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


module.exports.getProducts = getProducts;
module.exports.getProduct = getProduct;
module.exports.getCategories = getCategories;
module.exports.addCategory = addCategory;
