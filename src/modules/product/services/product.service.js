const getPagination = (page, size) => {
    const items = size ? +size : 3;
    const offset = page ? page * items : 0;

    return { items, offset };
};

const getPagingData = (data, limit, offset) => {
    const { count: total, rows: products } = data;
    const start = total - offset;
    const end = parseInt(limit) + offset;
    const pages = Math.ceil(total / limit);

    return {
        meta: { total, start, end, pages },
        products
    };
};

module.exports.getPagination = getPagination;
module.exports.getPagingData = getPagingData;