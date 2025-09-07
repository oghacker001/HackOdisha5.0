import User from '../models/userModels.js';
import Donation from '../models/donation.js';
import Campaign from '../models/Campaign.js';
import Event from '../models/event.js';
import mongoose from 'mongoose';

// Get current user profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.success(user, "User profile retrieved successfully");
    } catch (err) {
        next(err);
    }
};

// Update profile
export const updateProfile = async (req, res, next) => {
    try {
        const { displayName, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (displayName) user.displayName = displayName;
        if (email) user.email = email;

        await user.save();
        res.success(user, "Profile updated successfully");
    } catch (err) {
        next(err);
    }
};

// Get user donations (Donations controller version is better)
export const getUserDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find({ user: req.user.id });
        res.success(donations, "User donations retrieved successfully");
    } catch (err) {
        next(err);
    }
};

// Delete user account
export const deleteAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await Donation.deleteMany({ user: req.user.id });
        await Campaign.deleteMany({ organizer: req.user.id });
        await Event.deleteMany({ organizer: req.user.id });
        await User.findByIdAndDelete(req.user.id);

        res.success(null, "User account and all associated data have been deleted successfully");
    } catch (err) {
        next(err);
    }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.profilePhoto = req.file.filename;

        await user.save();
        res.success({ filename: req.file.filename }, "Profile photo uploaded successfully");
    } catch (err) {
        next(err);
    }
};

export const getProfilePhoto = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profilePhoto) {
            return res.status(404).json({ message: "No profile photo found" });
        }
        res.redirect(`/image/${user.profilePhoto}`);
    } catch (err) {
        next(err);
    }
};
