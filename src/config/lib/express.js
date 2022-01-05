const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const config = require('../config');
const nodecache = require('./nodecache');

module.exports = async function () {
    const app = express();

    app.use(cookieParser(nodecache.getValue('COOKIE_SECRET')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.set('port', process.env.PORT);

    const globalConfig = config.getGlobalConfig();

    globalConfig.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });

    globalConfig.strategies.forEach(function (strategy) {
        require(path.resolve(strategy))();
    });

    return app;
};
