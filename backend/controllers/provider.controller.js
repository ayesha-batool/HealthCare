import Provider from "../models/Provider.model.js";
import mongoose from "mongoose";

export const getProviders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Filtering
        const filter = {};
        if (req.query.specialty) filter.specialty = { $regex: req.query.specialty, $options: 'i' };
        
        // Searching
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { specialty: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        const providers = await Provider.find(filter)
            .sort({ name: 1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Provider.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            data: providers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log("Error in fetching providers", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getProviderById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Provider Id" });
    }
    try {
        const provider = await Provider.findById(id);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }
        res.status(200).json({ success: true, data: provider });
    } catch (error) {
        console.log("Error in fetching provider", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const createProvider = async (req, res) => {
    try {
        const provider = req.body;
        
        // Validation
        if (!provider.name || !provider.specialty || !provider.email || !provider.phone) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(provider.email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }
        
        const newProvider = new Provider(provider);
        const savedProvider = await newProvider.save();
        
        res.status(201).json({ success: true, data: savedProvider });
    } catch (error) {
        console.error("Error in creating provider:", error.message);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Provider with this email already exists"
            });
        }
        
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

export const updateProvider = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Provider Id" });
    }
    
    try {
        const provider = req.body;
        
        const updatedProvider = await Provider.findByIdAndUpdate(
            id,
            provider,
            { new: true, runValidators: true }
        );
        
        if (!updatedProvider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }
        
        res.status(200).json({ success: true, data: updatedProvider });
    } catch (error) {
        console.log("Error in updating provider", error.message);
        
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

export const deleteProvider = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Provider Id" });
    }
    
    try {
        const provider = await Provider.findByIdAndDelete(id);
        if (!provider) {
            return res.status(404).json({ success: false, message: "Provider not found" });
        }
        res.status(200).json({ success: true, message: "Provider deleted successfully" });
    } catch (error) {
        console.log("Error in deleting provider", error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
