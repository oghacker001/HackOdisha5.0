import Campaign from "../models/Campaign.js";
import User from "../models/userModels.js";
import Event from "../models/event.js";
import Comment from "../models/comment.js";
import mongoose from "mongoose";

// Campaign Management (Existing Functions)
export const listCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find().populate("organizer", "displayName email");
        res.success(campaigns, "Campaigns retrieved successfully");
    } catch (err) { next(err); }
};
export const approveCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findByIdAndUpdate(campaignId, { status: "approved" }, { new: true });
        if (!campaign) return res.status(404).json({ message: "❌ Campaign not found" });
        res.success(campaign, "Campaign approved");
    } catch (err) { next(err); }
};
export const rejectCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findByIdAndUpdate(campaignId, { status: "rejected" }, { new: true });
        if (!campaign) return res.status(404).json({ message: "❌ Campaign not found" });
        res.success(campaign, "Campaign rejected");
    } catch (err) { next(err); }
};

// Organizer Management (Existing Functions)
export const listOrganizers = async (req, res, next) => {
    try {
        const organizers = await User.find({ role: 'organizer' }).select('-password');
        res.success(organizers, "Organizers retrieved successfully");
    } catch (err) { next(err); }
};
export const suspendOrganizer = async (req, res, next) => {
    try {
        const { organizerId } = req.params;
        const organizer = await User.findByIdAndUpdate(organizerId, { status: 'suspended' }, { new: true });
        if (!organizer) return res.status(404).json({ message: "❌ Organizer not found" });
        res.success(organizer, "Organizer suspended");
    } catch (err) { next(err); }
};

// Event Management (Existing Functions)
export const listEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate("organizer", "displayName email");
        res.success(events, "Events retrieved successfully");
    } catch (err) { next(err); }
};
export const approveEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndUpdate(eventId, { status: "approved" }, { new: true });
        if (!event) return res.status(404).json({ message: "❌ Event not found" });
        res.success(event, "Event approved");
    } catch (err) { next(err); }
};
export const rejectEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndUpdate(eventId, { status: "rejected" }, { new: true });
        if (!event) return res.status(404).json({ message: "❌ Event not found" });
        res.success(event, "Event rejected");
    } catch (err) { next(err); }
};

// Administrative Actions (Existing Functions)
export const deleteCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findByIdAndDelete(campaignId);
        if (!campaign) return res.status(404).json({ message: "❌ Campaign not found" });
        res.success(null, "✅ Campaign deleted successfully");
    } catch (err) { next(err); }
};
export const deleteEvent = async (req, res, next) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndDelete(eventId);
        if (!event) return res.status(404).json({ message: "❌ Event not found" });
        res.success(null, "✅ Event deleted successfully");
    } catch (err) { next(err); }
};

// Data Insights (Existing Functions)
export const getDashboardStats = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({});
        const events = await Event.find({});
        const totalCampaigns = campaigns.length;
        const approvedCampaigns = campaigns.filter(c => c.status === "approved").length;
        const pendingCampaigns = campaigns.filter(c => c.status === "pending").length;
        const totalFundsRaised = campaigns.reduce((acc, c) => acc + (c.collected_amount || 0), 0) + events.reduce((acc, e) => acc + (e.collectedAmount || 0), 0);
        const activeEvents = events.filter(e => e.status === "approved").length;
        res.success({
            totalCampaigns, approvedCampaigns, pendingCampaigns, totalFundsRaised, activeEvents,
        }, "Dashboard statistics retrieved");
    } catch (err) { next(err); }
};

export const deleteUserAccount = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) { return res.status(404).json({ message: "❌ User not found" }); }
        await Campaign.deleteMany({ organizer: userId });
        await Event.deleteMany({ organizer: userId });
        await User.findByIdAndDelete(userId);
        res.success(null, "✅ User and all associated data deleted successfully");
    } catch (err) { next(err); }
};

// 🆕 New: Comment Moderation
export const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ message: "❌ Comment not found" });
        }
        res.success(null, "✅ Comment deleted successfully");
    } catch (err) {
        next(err);
    }
};
