module.exports = {
    routes: [
        "src/modules/user/user.routes.js",
        "src/modules/user/*.routes.js",
        "src/modules/user/**/*.routes.js",
        "src/modules/shop/*.routes.js",
        "src/modules/shop/**/*.routes.js"
    ],
    strategies: [
        "src/modules/**/*.strategy.js"
    ]
};
