const express = require("express");

const router = express.Router();
const authREST = require("../controllers/AuthController");

router.post("/register", authREST.register);
router.post("/login", authREST.login);
router.get("/refresh-token", authREST.requestRefreshToken);

module.exports = router;
