const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRouter = require("./router/vendorRouter");
const bodyParser = require("body-parser");
const firmRouter= require("./router/firmRouter");
const path = require("path");
// Routers
const productRouter = require("./router/productRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection (no options needed in Mongoose 7+)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected successfully"))
  .catch((error) => console.log("MongoDb connection error:", error));



// Middleware
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse URL-encoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded images

// Routes

app.use(bodyParser.json());
app.use("/vendor", vendorRouter);
app.use("/firm", firmRouter);
app.use("/product", productRouter);

// Home route
app.get("/home", (req, res) => {
  res.send("<h1>Welcome to Venket Services</h1>");
});

// Start server
app.listen(PORT, () => {
  console.log(`SERVER STARTED AND RUNNING AT ${PORT}`);
});
