const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const AuthRouter = require("./routers/AuthRouter");
const EmployeeRouter = require("./routers/EmployeeRouter");
const ProductRouter = require("./routers/ProductRouter");
const CartItemRouter = require("./routers/CartItemRouter");
const CustomerRouter = require("./routers/CustomerRouter");
const CartRouter = require("./routers/CartRouter");
const BrandRouter = require("./routers/BrandRouter");
// Import hàm từ file employee.js

const { User, Employee, Product, Brand } = require("./models");

const sequelize = require("./db");

dotenv.config();

const app = express();
const cors = require("cors");

const port = process.env.PORT || 3001;
app.use(
  cors({
    origin: "http://localhost:3000", // Chỉ định nguồn cho phép
    methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức cho phép
    credentials: true, // Cho phép cookie cùng yêu cầu
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use("/api", AuthRouter);
app.use("/api", EmployeeRouter);
app.use("/api", ProductRouter);
app.use("/api", CartItemRouter);
app.use("/api", CustomerRouter);
app.use("/api", CartRouter);
app.use("/api", BrandRouter);
sequelize
  .sync({ force: false }) // `force: true` sẽ xóa và tạo lại bảng nếu đã tồn tại
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is running on port 3001");
    });
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });
