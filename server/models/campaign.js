import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who created the campaign
        required: true
    },
    goalAmount: {
        type: Number,
        required: true,
        min: 1
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ["Education", "Health", "Environment", "Community", "Other"],
        default: "Other"
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Completed", "Expired"],
        default: "Active"
    },
    image: {
        type: String, // optional campaign image/banner (URL)
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ✅ Model (capitalized, auto collection "campaigns")
const campaignModel = mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

export default campaignModel;
