const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const vendorRouter = require("./router/vendorRouter");
const firmRouter = require("./router/firmRouter");
const productRouter = require("./router/productRouter");

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`ERROR: Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = express();
const PORT = process.env.PORT || 4000;
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormatcess.env.NODE_ENV || 'development';

// Logging setup (file + console)
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });

// console-friendly dev log + persistent combined log
app.use(morgan("dev"));
app.use(morgan("combined", { stream: accessLogStream }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb connected successfully"))
  .catch((error) => console.log("MongoDb connection error:", error));

// ✅ Security Middleware
app.use(helmet());

// ✅ CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: "Too many login attempts, please try again later."
});

app.use(limiter);

// ✅ Middleware (ONLY THESE)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/vendor/login", authLimiter);
app.use("/vendor/register", authLimiter);
app.use("/vendor", vendorRouter);
app.use("/firm", firmRouter);
app.use("/product", productRouter);

// Root route
app.get("/", (req, res) => {
  res.send(`
    <h1>🍕 Food Services API</h1>
    <p>Backend server is running successfully!</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li><strong>POST</strong> /vendor/register - Register new vendor</li>
      <li><strong>POST</strong> /vendor/login - Login vendor</li>
      <li><strong>GET</strong> /vendor/all - Get all vendors</li>
      <li><strong>POST</strong> /firm/add-firm - Add firm (requires auth)</li>
      <li><strong>GET</strong> /firm/all - Get all firms</li>
      <li><strong>POST</strong> /product/add - Add product (requires auth)</li>
      <li><strong>GET</strong> /product/all - Get all products</li>
    </ul>
    <p><a href="/home">Go to Home</a></p>
  `);
});

// Home route
app.get("/home", (req, res) => {
  res.send("<h1>Welcome to Venket Services</h1>");
});

// Start server
app.listen(PORT, () => {
  console.log(`SERVER STARTED AND RUNNING AT ${PORT}`);
});
