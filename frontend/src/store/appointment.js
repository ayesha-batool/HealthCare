import { create } from "zustand";

export const useAppointmentStore = create((set) => ({
    appointments: [],
    providers: [],
    loading: false,
    error: null,
    setAppointments: (appointments) => set({ appointments }),
    setProviders: (providers) => set({ providers }),
    
    fetchAppointments: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/appointments");
            
            // Check if response is OK and content-type is JSON
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response. Is the backend server running?");
            }
            
            const data = await res.json();
            if (data.success) {
                set({ appointments: data.data, loading: false });
            } else {
                set({ loading: false, error: data.message });
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            set({ loading: false, error: error.message || "Failed to fetch appointments. Please ensure the backend server is running." });
        }
    },
    
    fetchProviders: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/providers");
            
            // Check if response is OK and content-type is JSON
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response. Is the backend server running?");
            }
            
            const data = await res.json();
            if (data.success) {
                set({ providers: data.data, loading: false });
            } else {
                set({ loading: false, error: data.message });
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            set({ loading: false, error: error.message || "Failed to fetch providers. Please ensure the backend server is running." });
        }
    },
    
    createAppointment: async (newAppointment) => {
        if (!newAppointment.patientName || !newAppointment.patientEmail || 
            !newAppointment.patientPhone || !newAppointment.providerName || 
            !newAppointment.providerSpecialty || !newAppointment.appointmentDate || 
            !newAppointment.appointmentTime || !newAppointment.reason) {
            return { success: false, message: "Please fill in all required fields" };
        }
        
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newAppointment)
            });
            
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    return { success: false, message: errorData.message || `Server Error: ${res.status}` };
                } else {
                    return { success: false, message: `Server Error: ${res.status}. Is the backend server running?` };
                }
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, message: "Server returned non-JSON response" };
            }
            
            const data = await res.json();
            if (data.success) {
                set((state) => ({ appointments: [...state.appointments, data.data] }));
                return { success: true, message: "Appointment booked successfully" };
            }
            return { success: false, message: "Failed to create appointment" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    },
    
    updateAppointment: async (appointmentId, updatedAppointment) => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedAppointment)
            });
            
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    return { success: false, message: errorData.message || `Server Error: ${res.status}` };
                } else {
                    return { success: false, message: `Server Error: ${res.status}` };
                }
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, message: "Server returned non-JSON response" };
            }
            
            const data = await res.json();
            if (data.success) {
                set((state) => ({
                    appointments: state.appointments.map((apt) =>
                        apt._id === appointmentId ? data.data : apt
                    )
                }));
                return { success: true, message: "Appointment updated successfully" };
            }
            return { success: false, message: "Failed to update appointment" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    },
    
    deleteAppointment: async (appointmentId) => {
        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: "DELETE"
            });
            
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    return { success: false, message: errorData.message || `Server Error: ${res.status}` };
                } else {
                    return { success: false, message: `Server Error: ${res.status}` };
                }
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, message: "Server returned non-JSON response" };
            }
            
            const data = await res.json();
            if (!data.success) {
                return { success: false, message: data.message || "Failed to delete appointment" };
            }
            
            set((state) => ({
                appointments: state.appointments.filter((apt) => apt._id !== appointmentId)
            }));
            return { success: true, message: "Appointment cancelled successfully" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    },
    
    getAppointmentsByPatient: async (email) => {
        try {
            const res = await fetch(`/api/appointments/patient/${email}`);
            const data = await res.json();
            if (data.success) {
                return { success: true, data: data.data };
            }
            return { success: false, message: "Failed to fetch appointments" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    },
    
    createProvider: async (newProvider) => {
        try {
            const res = await fetch("/api/providers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProvider)
            });
            
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    return { success: false, message: errorData.message || `Server Error: ${res.status}` };
                } else {
                    return { success: false, message: `Server Error: ${res.status}` };
                }
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, message: "Server returned non-JSON response" };
            }
            
            const data = await res.json();
            if (data.success) {
                set((state) => ({ providers: [...state.providers, data.data] }));
                return { success: true, message: "Provider added successfully" };
            }
            return { success: false, message: data.message || "Failed to create provider" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    },
    
    deleteProvider: async (providerId) => {
        try {
            const res = await fetch(`/api/providers/${providerId}`, {
                method: "DELETE"
            });
            
            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    return { success: false, message: errorData.message || `Server Error: ${res.status}` };
                } else {
                    return { success: false, message: `Server Error: ${res.status}` };
                }
            }
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, message: "Server returned non-JSON response" };
            }
            
            const data = await res.json();
            if (!data.success) {
                return { success: false, message: data.message || "Failed to delete provider" };
            }
            
            set((state) => ({
                providers: state.providers.filter((provider) => provider._id !== providerId)
            }));
            return { success: true, message: "Provider deleted successfully" };
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    }
}));

