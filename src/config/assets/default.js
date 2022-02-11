module.exports = {
    routes: [
        "src/modules/user/user.routes.js",
        "src/modules/user/*.routes.js",
        "src/modules/user/**/*.routes.js",
        "src/modules/shop/*.routes.js",
        "src/modules/shop/**/*.routes.js",
        "src/modules/product/*.routes.js",
        "src/modules/product/**/*.routes.js",
        "src/modules/category/*.routes.js",
        "src/modules/category/**/*.routes.js",
    ],
    strategies: [
        "src/modules/**/*.strategy.js"
    ]
};
