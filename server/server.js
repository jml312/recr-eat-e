if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db.js");

const app = express();

// Connect to MongoDB
connectDB();

// Initialize middleware
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", require("./routes/auth.routes.js"));
app.use("/api/recipes", require("./routes/recipes.routes.js"));
app.use("/api/user", require("./routes/user.routes.js"));

const PORT = process.env.PORT || 5000;
try {
  app.listen(PORT, () => console.log(`Listening on port ${PORT} ✅`));
} catch (error) {
  console.log("ERROR:", error);
}
