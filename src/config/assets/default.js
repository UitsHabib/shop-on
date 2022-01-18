module.exports = {
    routes: [
        "src/modules/user/user.routes.js",
        "src/modules/user/*.routes.js",
        "src/modules/user/**/*.routes.js",
        "src/modules/product/*.routes.js",
        "src/modules/product/**/*.routes.js",
    ],
    strategies: [
        "src/modules/**/*.strategy.js",
    ]
};
