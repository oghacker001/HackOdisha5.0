import Donation from "../models/donation.js";
import Campaign from "../models/campaign.js";
import User from "../models/userModels.js";
import mongoose from "mongoose";

// ✅ 1. Create Donation
export const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, message, paymentMethod } = req.body;
    const userId = req.user.id;

    // Check campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Create donation
    const donation = await Donation.create({
      donor: userId,
      campaign: campaignId,
      amount,
      message,
      paymentMethod,
      status: "Completed" // 👈 you can integrate payment gateway later
    });

    // Update campaign raisedAmount
    campaign.raisedAmount += amount;
    await campaign.save();

    // Update user donations & totalDonation
    await User.findByIdAndUpdate(userId, {
      $push: { donations: donation._id },
      $inc: { totalDonation: amount }
    });

    res.status(201).json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 2. Get All Donations by User (with campaign details)
export const getUserDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    const donations = await Donation.find({ donor: userId })
      .populate("campaign", "title description goalAmount raisedAmount category status image")
      .sort({ createdAt: -1 });

    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 3. Get Donation Stats (total count + sum)
export const getDonationStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Donation.aggregate([
      { $match: { donor: new mongoose.Types.ObjectId(userId), status: "Completed" } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalDonations: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      totalAmount: stats[0]?.totalAmount || 0,
      totalDonations: stats[0]?.totalDonations || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ 4. Cancel/Delete Donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const donation = await Donation.findOne({ _id: id, donor: userId });
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Rollback if donation was completed
    if (donation.status === "Completed") {
      const campaign = await Campaign.findById(donation.campaign);
      if (campaign) {
        campaign.raisedAmount -= donation.amount;
        if (campaign.raisedAmount < 0) campaign.raisedAmount = 0;
        await campaign.save();
      }

      await User.findByIdAndUpdate(userId, {
        $pull: { donations: donation._id },
        $inc: { totalDonation: -donation.amount }
      });
    }

    await donation.deleteOne();
    res.json({ success: true, message: "Donation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
