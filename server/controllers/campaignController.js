// controllers/campaignController.js
import mongoose from "mongoose";
import Campaign from "../models/campaign.js";

// Create Campaign (Organizer only)
export const createCampaign = async (req, res) => {
    try {
        const { title, description, goalAmount, deadline, category, image } = req.body;

        // Validate required fields
        if (!title || !description || !goalAmount || !deadline || !category) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        const campaign = await Campaign.create({
            title,
            description,
            goalAmount,
            deadline,
            category,
            image,
            organizer: req.user._id,
        });
        const populatedCampaign = await campaign.populate("organizer", "displayName email");

        res.status(201).json({ success: true, data: populatedCampaign });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().populate("organizer", "displayName email");
        res.status(200).json({ success: true, data: campaigns });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get single campaign
export const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid campaign ID" });
        }

        const campaign = await Campaign.findById(id).populate("organizer", "displayName email");
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

        res.status(200).json({ success: true, data: campaign });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update campaign (Organizer/Admin)
export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid campaign ID" });
        }

        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

        // Only organizer who created it or admin can update
        if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        Object.assign(campaign, req.body);
        const updated = await campaign.save();
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete campaign (Organizer/Admin)
export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid campaign ID" });
        }

        const campaign = await Campaign.findById(id);
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

        // Only organizer who created it or admin can delete
        if (campaign.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        await campaign.deleteOne();
        res.status(200).json({ success: true, message: "Campaign deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
