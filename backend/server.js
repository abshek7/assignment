const express = require("express");
const connectDB = require("./api/config/db");
const bookRoutes = require("./api/routes/book.routes");
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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// **Base Route**
app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully!" });
});

// **API Routes**
app.use("/api/books", bookRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export app (Jest needs this)
