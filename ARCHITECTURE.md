# Healthcare Appointment System - Architecture Pipeline

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite) - Port 5173                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Pages      │  │  Components  │  │    Store     │   │   │
│  │  │              │  │              │  │  (Zustand)   │   │   │
│  │  │ HomePage     │  │ Appointment  │  │              │   │   │
│  │  │ CreatePage   │  │    Card      │  │  State Mgmt  │   │   │
│  │  │ ProvidersPage│  │   Navbar     │  │              │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (Proxy: /api → localhost:5000)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Backend - Port 5000                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   Routes     │  │ Controllers  │  │   Models     │   │   │
│  │  │              │  │              │  │              │   │   │
│  │  │ /appointments│  │ appointment  │  │ Appointment  │   │   │
│  │  │ /providers   │  │ controller   │  │ Provider     │   │   │
│  │  │              │  │ provider     │  │ Patient      │   │   │
│  │  │              │  │ controller   │  │              │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB Database                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ appointments │  │  providers   │  │   patients   │   │   │
│  │  │  collection  │  │  collection  │  │  collection  │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Request-Response Pipeline

### 1. Appointment Booking Flow

```
User Action (CreatePage)
    │
    ├─► User fills form
    │
    ├─► handleBookAppointment()
    │
    ├─► useAppointmentStore.createAppointment()
    │   │
    │   ├─► Validation (client-side)
    │   │
    │   ├─► POST /api/appointments
    │   │   │
    │   │   ├─► Vite Proxy: /api → http://localhost:5000
    │   │   │
    │   │   ├─► Express Router: appointment.route.js
    │   │   │
    │   │   ├─► Controller: appointment.controller.js
    │   │   │   ├─► createAppointment()
    │   │   │   ├─► Validation (server-side)
    │   │   │   └─► new Appointment(data)
    │   │   │
    │   │   ├─► Model: Appointment.model.js
    │   │   │   └─► Mongoose Schema Validation
    │   │   │
    │   │   ├─► MongoDB: appointments collection
    │   │   │   └─► Insert document
    │   │   │
    │   │   └─► Response: { success: true, data: appointment }
    │   │
    │   ├─► Update Zustand Store
    │   │   └─► set({ appointments: [...appointments, newAppointment] })
    │   │
    │   └─► UI Update
    │       ├─► Toast notification
    │       └─► Navigate to HomePage
```

### 2. Fetch Appointments Flow

```
Component Mount (HomePage)
    │
    ├─► useEffect(() => fetchAppointments())
    │
    ├─► useAppointmentStore.fetchAppointments()
    │   │
    │   ├─► GET /api/appointments
    │   │   │
    │   │   ├─► Vite Proxy: /api → http://localhost:5000
    │   │   │
    │   │   ├─► Express Router: appointment.route.js
    │   │   │
    │   │   ├─► Controller: appointment.controller.js
    │   │   │   └─► getAppointments()
    │   │   │       └─► Appointment.find({}).sort(...)
    │   │   │
    │   │   ├─► MongoDB: Query appointments collection
    │   │   │   └─► Return sorted documents
    │   │   │
    │   │   └─► Response: { success: true, data: appointments[] }
    │   │
    │   ├─► Update Zustand Store
    │   │   └─► set({ appointments: data.data })
    │   │
    │   └─► UI Re-render
    │       └─► Display AppointmentCard components
```

### 3. Provider Management Flow

```
User Action (ProvidersPage)
    │
    ├─► Component Mount
    │   └─► useEffect(() => fetchProviders())
    │
    ├─► Add Provider
    │   │
    │   ├─► handleAddProvider()
    │   │
    │   ├─► useAppointmentStore.createProvider()
    │   │   │
    │   │   ├─► POST /api/providers
    │   │   │   │
    │   │   │   ├─► Express Router: provider.route.js
    │   │   │   │
    │   │   │   ├─► Controller: provider.controller.js
    │   │   │   │   └─► createProvider()
    │   │   │   │
    │   │   │   ├─► Model: Provider.model.js
    │   │   │   │   └─► Mongoose Schema Validation
    │   │   │   │
    │   │   │   ├─► MongoDB: providers collection
    │   │   │   │   └─► Insert document
    │   │   │   │
    │   │   │   └─► Response: { success: true, data: provider }
    │   │   │
    │   │   └─► Update Store & UI
    │   │
    │   └─► Delete Provider
    │       │
    │       ├─► handleDeleteProvider(providerId)
    │       │
    │       ├─► useAppointmentStore.deleteProvider()
    │       │   │
    │       │   ├─► DELETE /api/providers/:id
    │       │   │   │
    │       │   │   ├─► Controller: provider.controller.js
    │       │   │   │   └─► deleteProvider()
    │       │   │   │
    │       │   │   ├─► MongoDB: Delete document
    │       │   │   │
    │       │   │   └─► Response: { success: true, message: "..." }
    │       │   │
    │       │   └─► Update Store & UI
```

## Component Architecture

```
App.jsx (Root Component)
    │
    ├─► ChakraProvider (Theme)
    │
    ├─► Router (React Router)
    │   │
    │   ├─► Routes
    │       │
    │       ├─► Route: "/"
    │       │   └─► HomePage
    │       │       ├─► useAppointmentStore
    │       │       └─► AppointmentCard[] (mapped)
    │       │
    │       ├─► Route: "/book"
    │       │   └─► CreatePage
    │       │       ├─► useAppointmentStore
    │       │       └─► Form Fields (dynamic)
    │       │
    │       └─► Route: "/providers"
    │           └─► ProvidersPage
    │               ├─► useAppointmentStore
    │               └─► Provider Cards (mapped)
    │
    └─► Navbar (Global)
        ├─► Navigation Links
        └─► Theme Toggle
```

## State Management Pipeline (Zustand)

```
Zustand Store (appointment.js)
    │
    ├─► State
    │   ├─► appointments: []
    │   └─► providers: []
    │
    ├─► Actions
    │   │
    │   ├─► fetchAppointments()
    │   │   ├─► API Call: GET /api/appointments
    │   │   └─► set({ appointments: data })
    │   │
    │   ├─► fetchProviders()
    │   │   ├─► API Call: GET /api/providers
    │   │   └─► set({ providers: data })
    │   │
    │   ├─► createAppointment(data)
    │   │   ├─► API Call: POST /api/appointments
    │   │   └─► set({ appointments: [...appointments, new] })
    │   │
    │   ├─► updateAppointment(id, data)
    │   │   ├─► API Call: PUT /api/appointments/:id
    │   │   └─► set({ appointments: map(...) })
    │   │
    │   ├─► deleteAppointment(id)
    │   │   ├─► API Call: DELETE /api/appointments/:id
    │   │   └─► set({ appointments: filter(...) })
    │   │
    │   ├─► createProvider(data)
    │   │   ├─► API Call: POST /api/providers
    │   │   └─► set({ providers: [...providers, new] })
    │   │
    │   └─► deleteProvider(id)
    │       ├─► API Call: DELETE /api/providers/:id
    │       └─► set({ providers: filter(...) })
```

## API Request Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client Request                                           │
│    Component → Zustand Store → fetch()                      │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Vite Proxy (Development)                                 │
│    /api/* → http://localhost:5000/api/*                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Express Middleware                                       │
│    app.use(express.json())                                  │
│    Parse JSON body                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Route Handler                                            │
│    app.use("/api/appointments", appointmentRoutes)          │
│    app.use("/api/providers", providerRoutes)               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Controller                                                │
│    - Validate input                                         │
│    - Business logic                                         │
│    - Database operations                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Model (Mongoose)                                         │
│    - Schema validation                                      │
│    - Database query/update                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. MongoDB                                                   │
│    - Execute query                                          │
│    - Return data                                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Response Pipeline (Reverse)                              │
│    MongoDB → Model → Controller → Route → Client            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ User Interaction
       ▼
┌─────────────────┐
│  React Component│
│  (UI Layer)     │
└──────┬──────────┘
       │
       │ Component State / Props
       ▼
┌─────────────────┐
│  Zustand Store  │
│  (State Mgmt)   │
└──────┬──────────┘
       │
       │ API Call (fetch)
       ▼
┌─────────────────┐
│  Express Server │
│  (API Layer)    │
└──────┬──────────┘
       │
       │ Mongoose Query
       ▼
┌─────────────────┐
│     MongoDB     │
│  (Data Layer)   │
└─────────────────┘
```

## File Structure & Responsibilities

```
backend/
├── index.js                    # Server entry point, middleware setup
├── config/
│   └── db.js                   # MongoDB connection configuration
├── models/                     # Mongoose schemas
│   ├── Appointment.model.js    # Appointment data structure
│   ├── Provider.model.js       # Provider data structure
│   └── Patient.model.js        # Patient data structure
├── controllers/                 # Business logic
│   ├── appointment.controller.js  # Appointment CRUD operations
│   └── provider.controller.js     # Provider CRUD operations
└── routes/                      # API route definitions
    ├── appointment.route.js    # Appointment endpoints
    └── provider.route.js       # Provider endpoints

frontend/
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component, routing
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── AppointmentCard.jsx # Appointment display card
│   ├── pages/                  # Page components
│   │   ├── HomePage.jsx        # Appointments list view
│   │   ├── CreatePage.jsx      # Appointment booking form
│   │   └── ProvidersPage.jsx   # Provider management
│   └── store/
│       └── appointment.js      # Zustand state management
```

## Technology Stack & Communication

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend Technologies                                        │
├─────────────────────────────────────────────────────────────┤
│ • React 18+          - UI framework                         │
│ • Vite               - Build tool & dev server              │
│ • Chakra UI          - Component library                    │
│ • Zustand            - State management                      │
│ • React Router       - Client-side routing                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Backend Technologies                                         │
├─────────────────────────────────────────────────────────────┤
│ • Node.js            - Runtime environment                  │
│ • Express.js         - Web framework                        │
│ • Mongoose           - MongoDB ODM                          │
│ • dotenv             - Environment variables                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Communication Protocol                                       │
├─────────────────────────────────────────────────────────────┤
│ • HTTP/HTTPS         - Request/response protocol            │
│ • REST API           - API architecture                     │
│ • JSON               - Data interchange format              │
│ • Vite Proxy         - Development proxy (/api → :5000)     │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ Error Flow                                                   │
├─────────────────────────────────────────────────────────────┤
│ 1. Client-side Validation                                   │
│    └─► Form validation before API call                     │
│                                                              │
│ 2. API Request Error                                        │
│    └─► Network error, timeout                              │
│        └─► Catch in Zustand store                           │
│            └─► Return { success: false, message: "..." }    │
│                                                              │
│ 3. Server-side Validation                                   │
│    └─► Controller validation                                │
│        └─► Return 400 Bad Request                           │
│                                                              │
│ 4. Database Error                                            │
│    └─► Mongoose validation error                            │
│        └─► Return 500 Server Error                           │
│                                                              │
│ 5. UI Error Display                                         │
│    └─► Toast notification (Chakra UI)                      │
│        └─► Show error message to user                      │
└─────────────────────────────────────────────────────────────┘
```

## Development Workflow

```
1. Start MongoDB
   └─► mongod (or MongoDB Atlas connection)

2. Start Backend Server
   └─► npm run dev (nodemon backend/index.js)
       └─► Server runs on port 5000

3. Start Frontend Dev Server
   └─► cd frontend && npm run dev
       └─► Vite dev server on port 5173
       └─► Proxy configured: /api → localhost:5000

4. Development Flow
   └─► Code changes → Hot reload
       ├─► Frontend: Vite HMR
       └─► Backend: Nodemon restart
```

## Production Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ Build Process                                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Frontend Build                                           │
│    npm run build                                            │
│    └─► Vite bundles React app                               │
│        └─► Output: frontend/dist/                          │
│                                                              │
│ 2. Backend Preparation                                      │
│    └─► Ensure .env configured                              │
│        └─► MONGO_URI, PORT, NODE_ENV                       │
│                                                              │
│ 3. Production Start                                         │
│    npm start                                                │
│    └─► NODE_ENV=production node backend/index.js           │
│        └─► Server serves static files + API                │
└─────────────────────────────────────────────────────────────┘
```

