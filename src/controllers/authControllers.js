require("dotenv").config();
const { signJWT, validateJWT } = require("../utils/jwtUtils.js");
const { hashPassword, verifyPassword } = require("../utils/bcryptjs.js");
const axios = require("axios");

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
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
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
      "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)",
      [fullname, email, hashedPassword]
    );
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  // Verify the reCAPTCHA token with Google
  try {
    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    const { success, "error-codes": errorCodes } = recaptchaResponse.data;

    // Detailed logging for reCAPTCHA success
    if (success) {
      console.log("reCAPTCHA verification succeeded");
      console.log("Challenge timestamp:", recaptchaResponse.data.challenge_ts); // Optional: Timestamp of the reCAPTCHA challenge
      console.log("Hostname:", recaptchaResponse.data.hostname); // Optional: Hostname of the site that verified the reCAPTCHA
    } else {
      // Provide more context for reCAPTCHA failure
      console.error("reCAPTCHA verification failed:", errorCodes);

      let errorMessage = "reCAPTCHA verification failed. ";

      if (errorCodes.includes("timeout-or-duplicate")) {
        errorMessage +=
          "The reCAPTCHA response was either expired or duplicated. Try refreshing the page and submitting again.";
      } else if (errorCodes.includes("invalid-input-secret")) {
        errorMessage +=
          "The secret key provided is incorrect. Ensure you're using the correct reCAPTCHA secret key.";
      } else if (errorCodes.includes("missing-input-response")) {
        errorMessage +=
          "The reCAPTCHA response token is missing. Ensure the frontend is sending the token.";
      } else {
        errorMessage += "Check the reCAPTCHA configuration and tokens.";
      }

      return res.status(400).json({
        message: errorMessage,
        errorCodes: errorCodes, // Include error codes for debugging
      });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return res.status(500).json({ message: "Error verifying reCAPTCHA" });
  }

  if (!email || !password) {
    return res.status(400).json({ error: "Email or password value missing" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = await signJWT(payload);
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyJwt = async (req, res) => {
  const { token } = req.body;
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
