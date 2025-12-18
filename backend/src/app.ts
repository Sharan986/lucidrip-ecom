import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";


import userRoutes from "./routes/user.routes";
import productRoutes from  "./routes/product.route"; 
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

//  routes
app.use("/api/users", userRoutes);       
app.use("/api/products", productRoutes); 


app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;