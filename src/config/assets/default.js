module.exports = {
    routes: [
        "src/modules/platform/user/user.routes.js",
        "src/modules/platform/user/*.routes.js",
        "src/modules/platform/user/**/*.routes.js",
        "src/modules/platform/profile/*.routes.js",
        "src/modules/platform/profile/**/*.routes.js",
        "src/modules/platform/role/*.routes.js",
        "src/modules/platform/role/**/*.routes.js",
        "src/modules/platform/permission/*.routes.js",
        "src/modules/platform/permission/**/*.routes.js",
        "src/modules/platform/service/*.routes.js",
        "src/modules/platform/service/**/*.routes.js",
        "src/modules/review/*.routes.js",
        "src/modules/review/**/*.routes.js",
    ],
    strategies: [
        "src/modules/**/*.strategy.js",
    ]
};
