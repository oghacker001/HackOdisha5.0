import Campaign from "../models/Campaign.js";
import User from "../models/userModels.js";
import Event from "../models/event.js";
import Comment from "../models/comment.js";
import Update from "../models/update.js";
import mongoose from "mongoose";

export const createCampaign = async (req, res, next) => {
    try {
        const { title, description, funding_goal, milestones, categories, location, social_media, termsAccepted } = req.body;
        
        if (!title || !description || !funding_goal || !termsAccepted) {
            return res.status(400).json({ message: "Please fill all required fields and accept the terms." });
        }
        
        const campaignImages = req.files.images ? req.files.images.map(file => file.filename) : [];
        const validationDocs = req.files.validation_docs ? req.files.validation_docs.map(file => file.filename) : [];

        const campaign = new Campaign({
            title, description, funding_goal, milestones, categories, location, social_media,
            organizer: req.userId,
            images: campaignImages,
            validation_docs: validationDocs,
            termsAccepted,
        });
        await campaign.save();
        res.success(campaign, "Campaign created successfully");
    } catch (err) { next(err); }
};

export const updateCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { title, description, funding_goal, milestones, categories, location, social_media } = req.body;
        
        const campaignImages = req.files.images ? req.files.images.map(file => file.filename) : undefined;
        const validationDocs = req.files.validation_docs ? req.files.validation_docs.map(file => file.filename) : undefined;

        const campaign = await Campaign.findOneAndUpdate(
            { _id: campaignId, organizer: req.userId, status: "pending" },
            { $set: { title, description, funding_goal, milestones, categories, location, social_media, images: campaignImages, validation_docs: validationDocs } },
            { new: true }
        );
        if (!campaign) {
            return res.status(404).json({ message: "❌ Campaign not found or not editable" });
        }
        res.success(campaign, "Campaign updated successfully");
    } catch (err) { next(err); }
};

export const deleteCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findOneAndDelete({ _id: campaignId, organizer: req.userId });
        if (!campaign) {
            return res.status(404).json({ message: "❌ Campaign not found or not owned by organizer" });
        }
        res.success(null, "Campaign deleted successfully");
    } catch (err) { next(err); }
};

export const listMyCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({ organizer: req.userId }).select("title status funding_goal collected_amount createdAt");
        res.success(campaigns, "Campaigns retrieved successfully");
    } catch (err) { next(err); }
};

export const createEvent = async (req, res, next) => {
    try {
        const { name, organization, startDate, endDate, goalAmount, description, termsAccepted } = req.body;
        
        if (!name || !organization || !startDate || !endDate || !goalAmount || !description || !termsAccepted) {
            return res.status(400).json({ message: "Please fill all required fields and accept the terms." });
        }
        
        const newEvent = new Event({
            name, organization, startDate, endDate, goalAmount, description,
            imageName: req.files.image ? req.files.image[0].filename : null,
            validation_doc: req.files.validation_doc ? req.files.validation_doc[0].filename : null,
            organizer: req.userId,
            termsAccepted,
        });
        await newEvent.save();
        res.success(newEvent, "Event created successfully");
    } catch (err) { next(err); }
};

export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findOneAndUpdate(
            { _id: id, organizer: req.userId },
            { $set: req.body, 
              imageName: req.files.image ? req.files.image[0].filename : undefined,
              validation_doc: req.files.validation_doc ? req.files.validation_doc[0].filename : undefined
            },
            { new: true }
        );
        if (!event) {
            return res.status(404).json({ message: "❌ Event not found or not owned by organizer" });
        }
        res.success(event, "Event updated successfully");
    } catch (err) { next(err); }
};

export const deleteEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findOneAndDelete({ _id: id, organizer: req.userId });
        if (!event) {
            return res.status(404).json({ message: "❌ Event not found or not owned by organizer" });
        }
        res.success(null, "Event deleted successfully");
    } catch (err) { next(err); }
};

export const listMyEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ organizer: req.userId }).sort({ createdAt: -1 });
        res.success(events, "Events retrieved successfully");
    } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
    try {
        const organizer = await User.findById(req.userId);
        if (!organizer) {
            return res.status(404).json({ message: "❌ Organizer not found" });
        }
        if (req.body.displayName) {
            organizer.displayName = req.body.displayName;
        }
        if (req.file) {
            organizer.profilePhoto = req.file.filename;
        }
        await organizer.save();
        res.success(organizer, "✅ Profile updated successfully");
    } catch (err) { next(err); }
};

export const deleteMyAccount = async (req, res, next) => {
    try {
        await Campaign.deleteMany({ organizer: req.userId });
        await Event.deleteMany({ organizer: req.userId });
        await User.findByIdAndDelete(req.userId);
        res.success(null, "✅ Your account and all associated data have been deleted successfully");
    } catch (err) { next(err); }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.success(user, "User profile retrieved successfully");
    } catch (err) { next(err); }
};

// New functions for campaign updates
export const createUpdate = async (req, res, next) => {
    try {
        const { text, campaignId } = req.body;
        if (!text || !campaignId) {
            return res.status(400).json({ message: "Update text and campaign ID are required." });
        }
        const newUpdate = new Update({
            text,
            campaign: campaignId,
            organizer: req.userId,
        });
        await newUpdate.save();
        res.success(newUpdate, "Campaign update created successfully");
    } catch (err) {
        next(err);
    }
};

export const getCampaignUpdates = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const updates = await Update.find({ campaign: campaignId })
            .populate('organizer', 'displayName profilePhoto')
            .sort({ createdAt: -1 });
        res.success(updates, "Campaign updates retrieved successfully");
    } catch (err) {
        next(err);
    }
};