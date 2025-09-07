import Campaign from "../models/Campaign.js";
import Event from "../models/event.js";

// @desc    Search for campaigns and events by query
// @route   GET /api/search?q=query
// @access  Public
export const searchAll = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Search query is required." });
        }

        // Create a case-insensitive regex
        const regex = new RegExp(query, 'i');

        // FIXED: Only search approved campaigns and events for public access
        const campaigns = await Campaign.find({
            status: "approved", // Only show approved campaigns
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { categories: { $regex: regex } } // FIXED: Use regex for categories too
            ]
        }).populate("organizer", "displayName profilePhoto");

        const events = await Event.find({
            status: "approved", // Only show approved events
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
            ]
        }).populate("organizer", "displayName profilePhoto");

        res.success({ campaigns, events }, "Search results retrieved successfully");

    } catch (err) {
        next(err);
    }
};