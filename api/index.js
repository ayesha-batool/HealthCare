import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../backend/config/db.js";
import appointmentRoutes from "../backend/routes/appointment.route.js";
import providerRoutes from "../backend/routes/provider.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, x-user-role');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Connect to database (only once)
let dbConnected = false;
if (!dbConnected) {
    connectDB();
    dbConnected = true;
}

// Routes
app.use("/appointments", appointmentRoutes);
app.use("/providers", providerRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is running" });
});

// Export for Vercel serverless
export default app;

