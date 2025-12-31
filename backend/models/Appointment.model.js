import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: false
    },
    patientName: {
        type: String,
        required: true
    },
    patientEmail: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    patientPhone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[\d\s\-\+\(\)]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    providerName: {
        type: String,
        required: true
    },
    providerSpecialty: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(v) {
                return v >= new Date();
            },
            message: 'Appointment date must be in the future'
        }
    },
    appointmentTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Please enter a valid time (HH:MM format)'
        }
    },
    reason: {
        type: String,
        required: true,
        minlength: [10, 'Reason must be at least 10 characters long']
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    notes: {
        type: String,
        default: '',
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ patientEmail: 1 });
appointmentSchema.index({ provider: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
