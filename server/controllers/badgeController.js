import Donation from "../models/donation.js";
import User from "../models/userModels.js";

/**
 * Helper: aggregate donor totals
 */
async function getDonorTotals() {
  const pipeline = [
    {
      $group: {
        _id: "$donor",
        totalAmount: { $sum: "$amount" },
        donationCount: { $sum: 1 },
      },
    },
    { $sort: { totalAmount: -1 } },
  ];
  return Donation.aggregate(pipeline);
}

/**
 * Helper: attach user details + rank + badge
 */
async function enrichWithUserDetails(sortedTotals) {
  const donorIds = sortedTotals.map((d) => d._id);
  const users = await User.find({ _id: { $in: donorIds } })
    .select("name email avatar")
    .lean();

  const usersById = users.reduce((acc, u) => {
    acc[u._id.toString()] = u;
    return acc;
  }, {});

  return sortedTotals.map((entry, index) => {
    const rank = index + 1;
    let badge = null;
    if (rank === 1) badge = "gold";
    else if (rank === 2) badge = "silver";
    else if (rank === 3) badge = "bronze";

    return {
      user: usersById[entry._id.toString()] || { _id: entry._id, name: "Unknown" },
      totalAmount: entry.totalAmount,
      donationCount: entry.donationCount,
      rank,
      badge,
    };
  });
}

// ✅ GET /badges/top?limit=10
export const getTopDonors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 100);
    const totals = await getDonorTotals();
    const top = totals.slice(0, limit);
    const enriched = await enrichWithUserDetails(top);
    res.json({ success: true, top: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /badges/leaderboard?page=1&limit=20
export const getLeaderboard = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
    const skip = (page - 1) * limit;

    const totals = await getDonorTotals();
    const pageSlice = totals.slice(skip, skip + limit);
    const enriched = await enrichWithUserDetails(pageSlice);

    res.json({
      success: true,
      page,
      limit,
      totalDonors: totals.length,
      leaderboard: enriched,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /badges/rank/:userId  OR /badges/my-rank (if auth)
export const getUserRank = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const totals = await getDonorTotals();
    const index = totals.findIndex((t) => t._id.toString() === userId.toString());

    if (index === -1) {
      return res.json({ success: true, isDonor: false, message: "User hasn't donated yet" });
    }

    const rank = index + 1;
    const entry = totals[index];
    const user = await User.findById(userId).select("name email avatar").lean();

    let badge = null;
    if (rank === 1) badge = "gold";
    else if (rank === 2) badge = "silver";
    else if (rank === 3) badge = "bronze";

    res.json({
      success: true,
      user,
      totalAmount: entry.totalAmount,
      donationCount: entry.donationCount,
      rank,
      badge,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
