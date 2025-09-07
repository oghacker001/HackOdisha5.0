import Comment from "../models/comment.js";
import Campaign from "../models/Campaign.js";

export const createComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const { campaignId } = req.params;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required." });
        }

        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found." });
        }

        const newComment = new Comment({
            text,
            user: req.userId,
            campaign: campaignId,
        });

        await newComment.save();
        res.success(newComment, "Comment created successfully");
    } catch (err) {
        next(err);
    }
};

export const getCampaignComments = async (req, res, next) => {
    try {
        const { campaignId } = req.params;

        const comments = await Comment.find({ campaign: campaignId })
            .populate('user', 'displayName profilePhoto')
            .sort({ createdAt: -1 });

        res.success(comments, "Comments retrieved successfully");
    } catch (err) {
        next(err);
    }
};