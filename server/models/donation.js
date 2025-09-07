import mongoose from "mongoose";
const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
  amount: { type: Number, required: true, min: 1 },
  message: { type: String, trim: true, maxlength: 250 },
  paymentMethod: { type: String, enum: ["Card", "UPI"], default: "UPI" },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const Donation = mongoose.model('Donation', DonationSchema);
export default Donation;