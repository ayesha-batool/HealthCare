import express from "express";
import dotenv from "dotenv";
import { connectDB } from "../backend/config/db.js";
import appointmentRoutes from "../backend/routes/appointment.route.js";
import providerRoutes from "../backend/routes/provider.route.js";

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

// Connect to database (optimized for serverless - connection is cached)
connectDB().catch(console.error);

// Routes - Vercel will prefix these with /api
app.use("/appointments", appointmentRoutes);
app.use("/providers", providerRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() });
});

// Root API endpoint
app.get("/", (req, res) => {
    res.json({ message: "Healthcare Appointment System API", version: "1.0.0" });
});

// Export for Vercel serverless
// NOTE: NO app.listen() here - Vercel handles the server automatically
export default app;
