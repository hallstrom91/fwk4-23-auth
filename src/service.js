require("dotenv").config({ path: [".env.development.local", ".env"] });
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/token", authRoutes);

module.exports = app;
