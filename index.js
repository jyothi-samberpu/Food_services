const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const vendorRouter = require("./router/vendorRouter");
const bodyParser = require("body-parser");
const firmRouter= require("./router/firmRouter");
const path = require("path");
// Routers
const productRouter = require("./router/productRouter");

const app = express();
const PORT = process.env.PORT || 4000;

// Check if MONGO_URL is set
if (!process.env.MONGO_URL) {
  console.error("ERROR: MONGO_URL environment variable is not set!");
  process.exit(1);
}

// MongoDB connection (no options needed in Mongoose 7+)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected successfully"))
  .catch((error) => {
    console.error("MongoDb connection error:", error);
    process.exit(1);
  });

// CORS - Allow frontend to connect
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://venket-services.onrender.com"],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' })); // parse JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // parse URL-encoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

// Routes
app.use("/vendor", vendorRouter);
app.use("/firm", firmRouter);
app.use("/product", productRouter);

// Home route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Venket Food Services API",
    version: "1.0.0",
    endpoints: {
      vendor: "/vendor",
      firm: "/firm",
      product: "/product"
    }
  });
});

app.get("/home", (req, res) => {
  res.send("<h1>Welcome to Venket Services</h1>");
});

// Start server
app.listen(PORT, () => {
  console.log(`SERVER STARTED AND RUNNING AT ${PORT}`);
});
