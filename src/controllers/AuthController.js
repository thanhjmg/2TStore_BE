const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, Employee, Customer } = require("../models");
const { TokenModel } = require("../models/Token");
const sequelize = require("../db");
const bscypt = require("bcrypt");

const authREST = {
  createAccessToken: (user) => {
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "30d",
      }
    );
    return accessToken;
  },
  createRefreshToken: (user) => {
    const refreshToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
    return refreshToken;
  },
  register: async (req, res) => {
    try {
      const existingUser = await User.findOne({
        where: { username: req.body.email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email đã tồn tại!" });
      }
      const salt = await bscypt.genSalt(10);
      const hashPass = await bscypt.hash(req.body.password, salt);
      let customer = "";
      const newAuth = await User.create({
        username: req.body.email,
        password: hashPass,
        role: req.body.role,
      });

      if (req.body.role === "customer") {
        customer = await Customer.create({
          fullName: req.body.fullName,
          email: req.body.email,
          userId: newAuth.id,
        });
      }

      res.status(200).json({ newAuth });
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      // Tìm user theo username (email)
      const user = await User.findOne({
        where: {
          username: req.body.email,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "Tên đăng nhập không hợp lệ!" });
      }

      // So sánh mật khẩu
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json({ message: "Mật khẩu không hợp lệ!" });
      }

      // Nếu user và mật khẩu hợp lệ
      let customer = null;
      let employee = null;
      if (user.role === "customer") {
        // Lấy thông tin customer nếu vai trò là customer
        customer = await Customer.findOne({ where: { userId: user.id } });
      } else if (user.role === "employee") {
        employee = await Employee.findOne({ where: { userId: user.id } });
      }

      const accessToken = authREST.createAccessToken(user);
      const refreshToken = authREST.createRefreshToken(user);

      // Lưu token refresh vào DB
      const saveRefreshToken = new TokenModel({ token: refreshToken });
      await saveRefreshToken.save();

      // Lưu token vào cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      // Trả về dữ liệu
      const { password, ...infoOthers } = user.dataValues;
      res.status(200).json({
        ...infoOthers,
        employeeId: employee ? employee.id : null,
        customerId: customer ? customer.id : null, // Trả về customerId nếu có
        accessToken,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Có lỗi xảy ra!" });
    }
  },
  requestRefreshToken: async (req, res) => {
    console.log(req.cookies);
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) res.status(401).json("Bạn chưa đăng nhập!");

      const findRefreshToken = await TokenModel.findOne({
        token: refreshToken,
      });
      if (!findRefreshToken)
        res.status(403).json("RefreshToken không khả dụng");

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN,
        async (err, user) => {
          if (err) {
            return res.status(403).json("Token không còn khả dụng!");
          }

          await TokenModel.deleteOne(findRefreshToken);
          const newAccessToken = authREST.createAccessToken(user);
          const newRefreshToken = authREST.createRefreshToken(user);

          const saveNewRefeshToken = new TokenModel({ token: newRefreshToken });
          await saveNewRefeshToken.save();

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res.status(200).json({ accessToken: newAccessToken });
        }
      );
    } catch (error) {
      res.status(500).json(error);
    }
  },

  createEmployee: async (req, res) => {
    const { password, fullname, email, position, role } = req.body;
    console.log(req.body);

    try {
      // Kiểm tra xem tất cả các trường yêu cầu có được cung cấp không
      if (!password || !fullname || !email || !position || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Băm mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      // Tạo tài khoản
      const user = await User.create({
        // Sử dụng create() để tạo mới
        username: email,
        password: hashPass,
        role: role,
      });

      // Tạo nhân viên
      const employee = await Employee.create({
        fullName: fullname,
        email: email,
        position: position,
        userId: user.id,
      });

      // Kiểm tra cả hai thao tác đều thành công
      if (employee && user) {
        res.status(201).json({
          message: "Tạo tài khoản và nhân viên thành công!",
          user,
          employee,
        });
      }
    } catch (error) {
      console.error(error); // Ghi lại chi tiết lỗi
      res.status(500).json({
        message: "An error occurred while creating employee",
        error: error.message,
      });
    }
  },
};
module.exports = authREST;
