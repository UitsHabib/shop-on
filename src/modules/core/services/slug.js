const uniqueSlug = require('unique-slug');

const convertToSlug = string => string.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

const makeCustomSlug = (title) => {
    const code = uniqueSlug(`${title}`);
    if (title.length > 50) return convertToSlug(`${title.substring(0, 50)} ${code}`);
    return convertToSlug(`${title} ${code}`);
};

module.exports.makeCustomSlug = makeCustomSlug;