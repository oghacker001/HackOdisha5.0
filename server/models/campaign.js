import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
    description: { type: String, required: true },
    target: { type: Number, required: true },
    status: { type: String, enum: ["pending", "achieved"], default: "pending" },
});

const CampaignSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    funding_goal: { type: Number, required: true },
    collected_amount: { type: Number, default: 0, min: 0 }, // FIXED: Added missing field
    milestones: [MilestoneSchema],
    categories: [{ type: String, index: true }],
    location: { type: String },
    social_media: {
        facebook: { type: String },
        twitter: { type: String },
        website: { type: String },
    },
    images: [{ type: String }],
    validation_docs: [{ type: String }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    termsAccepted: { type: Boolean, required: true, validate: [ (v) => v === true, 'You must accept the terms and conditions.' ] },
    createdAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.model('Campaign', CampaignSchema);
export default Campaign;