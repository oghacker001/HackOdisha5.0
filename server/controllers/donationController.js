import Donation from "../models/donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/userModels.js";
import mongoose from "mongoose";

// ✅ 1. Create Donation
export const createDonation = async (req, res, next) => {
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

    // Update campaign collectedAmount
    campaign.collectedAmount = (campaign.collectedAmount || 0) + amount;
    await campaign.save();

    res.status(201).json({ success: true, donation });
  } catch (err) {
    next(err);
  }
};

// ✅ 2. Get All Donations by User (with campaign details)
export const getUserDonations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const donations = await Donation.find({ donor: userId })
      .populate("campaign", "title description funding_goal collected_amount category status images")
      .sort({ createdAt: -1 });

    res.success(donations, "User donations retrieved successfully");
  } catch (err) {
    next(err);
  }
};

// ✅ 3. Get Donation Stats (total count + sum)
export const getDonationStats = async (req, res, next) => {
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

    res.success({
      totalAmount: stats[0]?.totalAmount || 0,
      totalDonations: stats[0]?.totalDonations || 0
    }, "Donation stats retrieved successfully");
  } catch (err) {
    next(err);
  }
};

// ✅ 4. Cancel/Delete Donation
export const deleteDonation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const donation = await Donation.findOne({ _id: id, donor: userId });
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Rollback if donation was completed
    if (donation.status === "Completed") {
      const campaign = await Campaign.findById(donation.campaign);
      if (campaign) {
        campaign.collectedAmount -= donation.amount;
        if (campaign.collectedAmount < 0) campaign.collectedAmount = 0;
        await campaign.save();
      }
    }

    await donation.deleteOne();
    res.success(null, "Donation deleted successfully");
  } catch (err) {
    next(err);
  }
};
