require("dotenv").config({ path: [".env.development.local", ".env"] });
const PORT = process.env.PORT || 3000;
const app = require("./service.js");

app.listen(PORT, () => {
  console.log(`Auth Server is live in local enviroment on port:${PORT}`);
});
