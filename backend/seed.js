import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import Provider from "./models/Provider.model.js";
import Appointment from "./models/Appointment.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const providers = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        email: "sarah.johnson@healthcare.com",
        phone: "+1-555-0101",
        availableHours: { start: "09:00", end: "17:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
        name: "Dr. Michael Chen",
        specialty: "Pediatrics",
        email: "michael.chen@healthcare.com",
        phone: "+1-555-0102",
        availableHours: { start: "08:00", end: "16:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    },
    {
        name: "Dr. Emily Rodriguez",
        specialty: "Dermatology",
        email: "emily.rodriguez@healthcare.com",
        phone: "+1-555-0103",
        availableHours: { start: "10:00", end: "18:00" },
        availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    },
    {
        name: "Dr. James Wilson",
        specialty: "Orthopedics",
        email: "james.wilson@healthcare.com",
        phone: "+1-555-0104",
        availableHours: { start: "09:00", end: "17:00" },
        availableDays: ["Monday", "Wednesday", "Thursday", "Friday"]
    },
    {
        name: "Dr. Lisa Anderson",
        specialty: "General Medicine",
        email: "lisa.anderson@healthcare.com",
        phone: "+1-555-0105",
        availableHours: { start: "08:00", end: "16:00" },
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
];

const appointments = [
    {
        patientName: "John Doe",
        patientEmail: "john.doe@email.com",
        patientPhone: "+1-555-1001",
        providerName: "Dr. Sarah Johnson",
        providerSpecialty: "Cardiology",
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        appointmentTime: "10:00",
        reason: "Routine heart checkup and ECG",
        status: "scheduled",
        notes: "Patient has history of hypertension"
    },
    {
        patientName: "Jane Smith",
        patientEmail: "jane.smith@email.com",
        patientPhone: "+1-555-1002",
        providerName: "Dr. Michael Chen",
        providerSpecialty: "Pediatrics",
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        appointmentTime: "14:30",
        reason: "Child vaccination and wellness check",
        status: "scheduled",
        notes: "Bring vaccination records"
    },
    {
        patientName: "Robert Brown",
        patientEmail: "robert.brown@email.com",
        patientPhone: "+1-555-1003",
        providerName: "Dr. Emily Rodriguez",
        providerSpecialty: "Dermatology",
        appointmentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        appointmentTime: "11:00",
        reason: "Skin condition evaluation",
        status: "completed",
        notes: "Prescribed topical treatment"
    },
    {
        patientName: "Maria Garcia",
        patientEmail: "maria.garcia@email.com",
        patientPhone: "+1-555-1004",
        providerName: "Dr. James Wilson",
        providerSpecialty: "Orthopedics",
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appointmentTime: "09:30",
        reason: "Knee pain consultation",
        status: "scheduled",
        notes: "Bring X-ray results if available"
    },
    {
        patientName: "David Lee",
        patientEmail: "david.lee@email.com",
        patientPhone: "+1-555-1005",
        providerName: "Dr. Lisa Anderson",
        providerSpecialty: "General Medicine",
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        appointmentTime: "15:00",
        reason: "Annual physical examination",
        status: "scheduled",
        notes: ""
    }
];

const seedData = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB");

        // Clear existing data
        await Provider.deleteMany({});
        await Appointment.deleteMany({});
        console.log("Cleared existing data");

        // Insert providers
        const insertedProviders = await Provider.insertMany(providers);
        console.log(`Inserted ${insertedProviders.length} providers`);

        // Insert appointments
        const insertedAppointments = await Appointment.insertMany(appointments);
        console.log(`Inserted ${insertedAppointments.length} appointments`);

        console.log("Demo data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();

