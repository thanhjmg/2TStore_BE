const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("token:", req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(403).json("Access Denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decoded; // Lưu thông tin người dùng vào req
    next();
  } catch (err) {
    return res.status(401).json("Invalid Token");
  }
};

const isEmployee = (req, res, next) => {
  if (req.user.role !== "employee" && req.user.role !== "manager") {
    return res
      .status(403)
      .json("You do not have permission to perform this action");
  }
  next();
};

const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res
      .status(403)
      .json("You do not have permission to perform this action");
  }
  next();
};

const isManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res
      .status(403)
      .json("You do not have permission to perform this action");
  }
  next();
};

module.exports = { verifyToken, isEmployee, isCustomer, isManager };
