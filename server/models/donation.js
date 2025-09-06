import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",    // who donated
        required: true
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign", // where the donation went
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1  // no zero/negative donations
    },
    message: {
        type: String,
        trim: true,
        maxlength: 250 // optional "support message"
    },
    paymentMethod: {
        type: String,
        enum: ["Card", "UPI"],
        default: "UPI"
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const donationModel = mongoose.models.Donation || mongoose.model("Donation", DonationSchema);

export default donationModel;