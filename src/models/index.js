const User = require("./User");
const Employee = require("./Employee");
const Brand = require("./Brand");
const Product = require("./Product");
const ProductDetail = require("./ProductDetail");
const Image = require("./Image");
const Size = require("./Size");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Customer = require("./Customer");

const ProductType = require("./ProductType");
const OrderDetail = require("./OrderDetail");
const Order = require("./Order");

// Thiết lập quan hệ 1-1 giữa User và Employee
Employee.hasOne(User, { foreignKey: "employeeId" }); // 1 Nhân viên có 1 tài khoản
User.belongsTo(Employee, { foreignKey: "employeeId" });
Customer.hasOne(User, { foreignKey: "customerId" }); // 1 Nhân viên có 1 tài khoản
User.belongsTo(Customer, { foreignKey: "customerId" });
Product.belongsTo(Brand, { foreignKey: "brandId" }); // Mỗi sản phẩm thuộc một brand
Brand.hasMany(Product, { foreignKey: "brandId" }); // Mỗi brand có nhiều sản phẩm // 1 Tài khoản thuộc về 1 nhân viên

Product.hasMany(Image, { foreignKey: "productId" });
Image.belongsTo(Product, { foreignKey: "productId" });

Product.hasMany(ProductDetail, { foreignKey: "productId" });
ProductDetail.belongsTo(Product, { foreignKey: "productId" });

Product.belongsTo(ProductType, { foreignKey: "productTypeId" }); // Mỗi sản phẩm thuộc một brand
ProductType.hasMany(Product, { foreignKey: "productTypeId" });

// Size Model
Size.hasMany(ProductDetail, { foreignKey: "sizeId" });
ProductDetail.belongsTo(Size, { foreignKey: "sizeId" });

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });
Customer.hasOne(Cart, { foreignKey: "customerId" });
Cart.belongsTo(Customer, { foreignKey: "customerId" });

Size.hasMany(OrderDetail, { foreignKey: "sizeId" });
OrderDetail.belongsTo(Size, { foreignKey: "sizeId" });

Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });
Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });
CartItem.belongsTo(Size, { foreignKey: "sizeId" });
Size.hasMany(CartItem, { foreignKey: "sizeId" });

module.exports = {
  User,
  Employee,
  Brand,
  ProductDetail,
  Size,
  Product,
  Image,
  CartItem,

  Customer,
  Cart,
  ProductType,
  Order,
  OrderDetail,
};
