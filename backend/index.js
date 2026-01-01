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

// CORS Configuration
const isAllowedOrigin = (origin) => {
    if (!origin) return false
    
    // Development origins
    if (process.env.NODE_ENV !== 'production') {
        const devOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000']
        return devOrigins.includes(origin)
    }
    
    // Production: Check exact match or Netlify domains
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return true
    }
    
    // Allow all Netlify domains
    if (origin.includes('.netlify.app') || origin.includes('.netlify.com')) {
        return true
    }
    
    return false
}

app.use((req, res, next) => {
    const origin = req.headers.origin
    
    if (isAllowedOrigin(origin)) {
        res.header('Access-Control-Allow-Origin', origin)
    } else if (process.env.NODE_ENV === 'development') {
        // In development, allow all origins
        res.header('Access-Control-Allow-Origin', origin || '*')
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key, x-user-role')
    res.header('Access-Control-Allow-Credentials', 'true')
    
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

// Root API endpoint
app.get("/", (req, res) => {
    res.json({ message: "Healthcare Appointment System API", version: "1.0.0" })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    connectDB()
})

