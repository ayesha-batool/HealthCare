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

// Vercel automatically routes /api/* to this serverless function
// We need to strip /api prefix so Express routes match correctly
app.use((req, res, next) => {
    // Log for debugging (can remove later)
    console.log('Incoming request:', {
        method: req.method,
        url: req.url,
        path: req.path,
        originalUrl: req.originalUrl
    });
    
    // Rewrite URL to remove /api prefix if present
    if (req.url && req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }
    if (req.path && req.path.startsWith('/api')) {
        // Also update path if it has /api
        const newPath = req.path.replace(/^\/api/, '') || '/';
        // Note: req.path is read-only, but req.url change should be enough
    }
    
    console.log('Processed request:', {
        method: req.method,
        url: req.url,
        path: req.path
    });
    
    next();
});

// CORS Configuration
// Supports both same-domain and separate deployments
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000',  // Alternative dev port
    '*' // Allow all in development (remove in production if using separate deployments)
].filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // In production with FRONTEND_URL, only allow that origin
    if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
        if (origin === process.env.FRONTEND_URL) {
            res.header('Access-Control-Allow-Origin', origin);
        }
    } else {
        // Development or no FRONTEND_URL: allow all
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, x-user-role');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Connect to database (optimized for serverless - connection is cached)
connectDB().catch(console.error);

// Routes
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
export default app;
