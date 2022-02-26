const ProductReview = require(path.join(process.cwd(), "src/modules/review/product-review.model"));
const ShopReview = require(path.join(process.cwd(), "src/modules/review/shop-review.model"));
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));

async function getProductReview(req, res) {
    try {
        const review = await ProductReview.findOne({ 
            where: { id: req.params.id },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function reviewProduct(req, res) {
    try {
        const { rating, comment } = req.body;
        const { id: productId } = req.params;
        const { id: customerId } = req.user;

        const product = await Product.findOne({ where: { id: productId }});
        
        if(!product) return res.status(404).send('Product not found.');

        const review = await ProductReview.create({
            customer_id: customerId,
            product_id: productId,
            rating,
            comment
        });

        res.status(201).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function updateProductReview (req, res) {
    try {
        const { rating, comment } = req.body;
        const { id: reviewId } = req.params;

        const review = await ProductReview.findOne({
            where: { id: reviewId },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        if (rating) review.update({ rating });
        if (comment) review.update({ comment });

        res.send(review);
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function deleteProductReview (req, res) {
    try {
        const { id: reviewId } = req.params;

        const review = await ProductReview.findOne({
            where: { id: reviewId },
            include: [
                {
                    model: Product,
                    as: 'product'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        await review.destroy();

        res.send(review);
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function getShopReview(req, res) {
    try {
        const review = await ShopReview.findOne({ 
            where: { id: req.params.id },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        res.status(200).send(review);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error!");
    }
};

async function reviewShop(req, res) {
    try {
        const { rating, comment } = req.body;
        const { id: shopId } = req.params;
        const { id: customerId } = req.user;

        const shop = await Shop.findOne({ where: { id: shopId }});
        
        if(!shop) return res.status(404).send('Shop not found.');

        const review = await ProductReview.create({
            customer_id: customerId,
            product_id: shopId,
            rating,
            comment
        });

        res.status(201).send(review);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function updateShopReview (req, res) {
    try {
        const { rating, comment } = req.body;
        const { id: reviewId } = req.params;

        const review = await ShopReview.findOne({
            where: { id: reviewId },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        if (rating) review.update({ rating });
        if (comment) review.update({ comment });

        res.send(review);
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

async function deleteShopReview (req, res) {
    try {
        const { id: reviewId } = req.params;

        const review = await ShopReview.findOne({
            where: { id: reviewId },
            include: [
                {
                    model: Shop,
                    as: 'shop'
                }
            ]
        });

        if (!review) return res.status(404).send("Review not found!");

        await review.destroy();

        res.send(review);
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Internal server error!");
    }
};

module.exports.getProductReview = getProductReview;
module.exports.reviewProduct = reviewProduct;
module.exports.updateProductReview = updateProductReview;
module.exports.deleteProductReview = deleteProductReview;
module.exports.getShopReview = getShopReview;
module.exports.reviewShop = reviewShop;
module.exports.updateShopReview = updateShopReview;
module.exports.deleteShopReview = deleteShopReview;