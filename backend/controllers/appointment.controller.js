import Appointment from "../models/Appointment.model.js";
import mongoose from "mongoose";

// Get all appointments with pagination, filtering, and searching
export const getAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Filtering
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.providerSpecialty) filter.providerSpecialty = req.query.providerSpecialty;
        if (req.query.startDate) filter.appointmentDate = { $gte: new Date(req.query.startDate) };
        if (req.query.endDate) {
            filter.appointmentDate = {
                ...filter.appointmentDate,
                $lte: new Date(req.query.endDate)
            };
        }
        
        // Searching
        if (req.query.search) {
            filter.$or = [
                { patientName: { $regex: req.query.search, $options: 'i' } },
                { patientEmail: { $regex: req.query.search, $options: 'i' } },
                { providerName: { $regex: req.query.search, $options: 'i' } },
                { reason: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Sorting
        const sortBy = req.query.sortBy || 'appointmentDate';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sort = { [sortBy]: sortOrder };
        
        const appointments = await Appointment.find(filter)
            .populate('provider', 'name specialty email phone')
            .sort(sort)
            .skip(skip)
            .limit(limit);
        
        const total = await Appointment.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            data: appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("Error in fetching appointments", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Appointment Id" });
    }
    try {
        const appointment = await Appointment.findById(id)
            .populate('provider', 'name specialty email phone availableHours availableDays');
        
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.log("Error in fetching appointment", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const createAppointment = async (req, res) => {
    try {
        const appointment = req.body;
        
        // Validation
        const requiredFields = ['patientName', 'patientEmail', 'patientPhone', 'providerName', 'providerSpecialty', 'appointmentDate', 'appointmentTime', 'reason'];
        const missingFields = requiredFields.filter(field => !appointment[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        const newAppointment = new Appointment(appointment);
        const savedAppointment = await newAppointment.save();
        
        // Populate relationships
        await savedAppointment.populate('provider');
        
        res.status(201).json({ success: true, data: savedAppointment });
    } catch (error) {
        console.error("Error in creating appointment:", error.message);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }
        
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateAppointment = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Appointment Id" });
    }
    
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('provider');
        
        if (!updatedAppointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        
        res.status(200).json({ success: true, data: updatedAppointment });
    } catch (error) {
        console.log("Error in updating appointment", error.message);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }
        
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Appointment Id" });
    }
    
    try {
        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        res.status(200).json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
        console.log("Error in deleting appointment", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getAppointmentsByPatient = async (req, res) => {
    const { email } = req.params;
    try {
        const appointments = await Appointment.find({ patientEmail: email })
            .populate('provider', 'name specialty email phone')
            .sort({ appointmentDate: 1, appointmentTime: 1 });
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.log("Error in fetching patient appointments", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
