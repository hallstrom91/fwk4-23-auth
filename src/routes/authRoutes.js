const express = require("express");
const { signJWT, validateJWT } = require("../utils/jwtUtils.js");

const router = express.Router();

router.post("/sign", async (req, res) => {
  const payload = req.body;

  if (!payload || !payload.userId || !payload.email || !payload.role) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const token = signJWT(payload);
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    const decoded = validateJWT(token);
    return res.status(200).json({ message: "Token is valid", decoded });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

module.exports = router;
