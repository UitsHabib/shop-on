module.exports = {
    routes: [
        "src/modules/user/user.routes.js",
        "src/modules/user/*.routes.js",
        "src/modules/user/**/*.routes.js",
        "src/modules/platform/profile/*.routes.js",
        "src/modules/platform/profile/**/*.routes.js",
    ],
    strategies: [
        "src/modules/**/*.strategy.js",
    ]
};
