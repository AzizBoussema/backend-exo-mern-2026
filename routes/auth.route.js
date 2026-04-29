const express = require("express");
const { register, login, current } = require("../controllers/auth.controller");
const {
  registerValidation,
  validation,
  loginValidation,
} = require("../middlewares/validators");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/register", registerValidation(), validation, register);
router.post("/login", loginValidation(), validation, login);
router.get("/current", isAuth, current);

module.exports = router;
