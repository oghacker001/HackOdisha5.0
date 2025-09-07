import Campaign from "../models/Campaign.js";
import User from "../models/userModels.js";
import Comment from "../models/comment.js";

export const createCampaign = async (req, res, next) => { /* ... */ };
export const updateCampaign = async (req, res, next) => { /* ... */ };
export const deleteCampaign = async (req, res, next) => { /* ... */ };

// ✅ Corrected: Only get campaigns with "approved" status
export const getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({ status: "approved" }).populate("organizer", "displayName profilePhoto");
        res.success(campaigns, "Campaigns retrieved successfully");
    } catch (err) { next(err); }
};

export const getCampaignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id).populate("organizer", "displayName profilePhoto");
        if (!campaign) return res.status(404).json({ message: "Campaign not found." });
        res.success(campaign, "Campaign retrieved successfully");
    } catch (err) { next(err); }
};
