const { signJWT, validateJWT } = require("../utils/jwtUtils.js");
const { hashPassword, verifyPassword } = require("../utils/bcryptjs.js");
const pool = require("../utils/connectDB.js");

const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email or password value missing." });
  }

  try {
    const [existingUser] = await pool.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
      [fullname, email, hashedPassword],
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email or password value missing" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await signJWT(payload);

    res.cookie("token", token, {
      httpOnly: false,
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyJwt = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    const decoded = validateJWT(token);
    return res.status(200).json({ verified: true, message: decoded });
  } catch (error) {
    return res.status(401).json({ verified: false, error: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyJwt };
