const express = require("express");
const { signJWT, validateJWT } = require("../utils/jwtUtils.js");
const {
  loginUser,
  registerUser,
} = require("../controllers/authControllers.js");
const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

module.exports = router;
