const path = require("path");
const sequelize = require(path.join(process.cwd(), "src/config/lib/sequelize"));
const { DataTypes } = require("sequelize");
const Product = require(path.join(process.cwd(), "src/modules/product/product.model"));

const Cart = sequelize.define("carts", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    customer_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    product_id: {
        allowNull: false,
        type: DataTypes.UUID,
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
    }
}, {
    tableName: "carts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

Cart.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });

module.exports = Cart;
