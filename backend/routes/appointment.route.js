import express from "express";
import {
    getAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByPatient
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.get("/patient/:email", getAppointmentsByPatient);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

export default router;

