const getPagination = (req) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 15;
    const offset = (page - 1) * limit;
    let { orderBy, orderType } = req.query;
    orderType = orderType || 'asc';
    let order = [['created_at', 'desc']];

    if (orderBy) {
        order.push([orderBy, orderType]);
    }

    return { page, offset, limit, order };
};

const getPagingData = (total, page, offset, limit, products) => {
    const data = {
        meta: {
            start: offset + 1,
            end: Math.min(total, page * limit),
            total,
            page
        },
        products
    };

    return data;
};

module.exports.getPagination = getPagination;
module.exports.getPagingData = getPagingData;