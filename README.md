# Healthcare Appointment System

A comprehensive MERN stack application for managing medical appointments. Patients can book, manage, and track appointments with healthcare providers.

## 🚀 Live Demo

[View on Vercel](https://your-app.vercel.app) (Update after deployment)

## Features

### Patient Features
- **Book Appointments**: Schedule appointments with healthcare providers
- **View Appointments**: See all scheduled appointments in a clean, organized view
- **Update Appointments**: Modify appointment details or reschedule
- **Cancel Appointments**: Cancel appointments when needed
- **Track Status**: View appointment status (scheduled, completed, cancelled, rescheduled)

### Provider Management
- **Add Providers**: Add new healthcare providers to the system
- **View Providers**: Browse available healthcare providers
- **Provider Details**: View provider specialties, contact information, and availability
- **Delete Providers**: Remove providers from the system

### Appointment Management
- **Patient Information**: Store patient name, email, and phone
- **Provider Selection**: Choose from available healthcare providers
- **Date & Time Selection**: Pick convenient appointment slots
- **Reason for Visit**: Document the purpose of the appointment
- **Notes**: Add additional notes or special requests
- **Status Tracking**: Monitor appointment status throughout the lifecycle

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **RESTful API** architecture

### Frontend
- **React** with Vite
- **Chakra UI** for modern, responsive design
- **Zustand** for state management
- **React Router** for navigation

## Project Structure

```
MernStack/
├── api/
│   └── index.js              # Vercel serverless function
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── appointment.controller.js
│   │   └── provider.controller.js
│   ├── models/
│   │   ├── Appointment.model.js
│   │   └── Provider.model.js
│   ├── routes/
│   │   ├── appointment.route.js
│   │   └── provider.route.js
│   └── seed.js                # Demo data seeder
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   └── ProvidersPage.jsx
│   │   ├── store/
│   │   │   └── appointment.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── vercel.json                # Vercel configuration
└── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/ayesha-batool/HealthCare.git
   cd HealthCare
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `NODE_ENV` - `production`
4. Deploy!

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments (with pagination, filtering, search)
- `GET /api/appointments/:id` - Get appointment by ID
- `GET /api/appointments/patient/:email` - Get appointments by patient email
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Providers
- `GET /api/providers` - Get all providers (with pagination, filtering, search)
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers` - Create new provider
- `PUT /api/providers/:id` - Update provider
- `DELETE /api/providers/:id` - Delete provider

### Query Parameters
- `page` - Page number for pagination
- `limit` - Items per page
- `search` - Search term
- `status` - Filter by status
- `specialty` - Filter by provider specialty
- `startDate` - Filter by start date
- `endDate` - Filter by end date
- `sortBy` - Field to sort by
- `sortOrder` - `asc` or `desc`

## Usage

### Booking an Appointment

1. Click "Book" in the navigation bar
2. Fill in patient information (name, email, phone)
3. Select a healthcare provider from the dropdown or enter manually
4. Choose appointment date and time
5. Enter reason for visit
6. Add any additional notes (optional)
7. Click "Book Appointment"

### Managing Appointments

- **View**: All appointments are displayed on the home page
- **Search**: Use the search bar to find appointments
- **Filter**: Filter by status using the dropdown
- **Edit**: Click the edit icon on any appointment card
- **Cancel**: Click the delete icon on any appointment card
- **Status**: Appointment status is shown with color-coded badges

### Managing Providers

1. Navigate to "Providers" page
2. Fill in provider details (name, specialty, email, phone)
3. Click "Add"
4. View all providers in a grid layout
5. Delete providers using the delete icon

## Features in Detail

### Appointment Status
- **Scheduled**: Newly booked appointment
- **Completed**: Appointment has been completed
- **Cancelled**: Appointment was cancelled
- **Rescheduled**: Appointment date/time was changed

### Responsive Design
The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

### Dark Mode
Toggle between light and dark themes using the theme switcher in the navigation bar.

## Demo Data

To populate the database with demo data:
```bash
npm run seed
```

This will create 5 sample providers and 5 sample appointments.

## Architecture

For detailed system architecture, data flow, and pipeline documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available for educational purposes.
