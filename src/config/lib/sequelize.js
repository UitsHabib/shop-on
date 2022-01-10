const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, 'root', '', {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
});

module.exports = sequelize;