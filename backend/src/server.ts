import dotenv from "dotenv";
import path from "path";
import express, { Application } from "express";
import cors from "cors";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Validate ALL required environment variables at startup
const requiredEnvVars = [
  "JWT_SECRET",
  "MONGO_URI",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "ADMIN_USERNAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD"
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`);
  console.error("Please check your .env file and ensure all required variables are set.");
  process.exit(1);
}

import connectDB from "./config/db";
import orderRoutes from "./routes/order.route";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.route";
import paymentRoutes from "./routes/payment.route";
import adminRoutes from "./routes/admin.route";

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware - Increase payload limit for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Routes
app.use("/api/users", userRoutes);       
app.use("/api/products", productRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.send("API is running...");
});

// Connect to DB and start server
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
