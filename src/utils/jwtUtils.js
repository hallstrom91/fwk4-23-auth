require("dotenv").config({ path: [".env.development.local", ".env"] });
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

const signJWT = async (payload) => {
  // catch payload input here - JSON
  const options = { expiresIn: "1h" };
  try {
    const token = jwt.sign(payload, secretKey, options);

    return token;
  } catch (error) {
    throw new Error("Failed to sign JWT");
  }
};

const validateJWT = async (token) => {
  if (!secretKey) {
    // if loading .env variable fails
    throw new Error("Missing secret encryption key");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { signJWT, validateJWT };
