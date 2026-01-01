import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { connectDB } from "./config/db.js"
import appointmentRoutes from "./routes/appointment.route.js"
import providerRoutes from "./routes/provider.route.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "../.env") })
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS (if needed for production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, x-user-role')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

// API Routes
app.use("/api/appointments", appointmentRoutes)
app.use("/api/providers", providerRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "API is running", timestamp: new Date().toISOString() })
})

// Serve static files from frontend/dist in production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.resolve(__dirname, "../frontend/dist")
    app.use(express.static(frontendPath))
    
    // Serve index.html for all non-API routes (SPA routing)
    app.get("*", (req, res) => {
        // Don't serve index.html for API routes
        if (req.path.startsWith("/api")) {
            return res.status(404).json({ error: "API route not found" })
        }
        res.sendFile(path.join(frontendPath, "index.html"))
    })
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    connectDB()
})

