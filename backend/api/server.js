const express = require("express");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/book.routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://assignment-seven-kappa-14.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure headers are allowed

  })
);

app.options("*", cors());

// Routes
app.use("/api/books", bookRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



module.exports = app; // Export app (Jest needs this)
