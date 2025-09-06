import { verifyToken } from "../utils/token.js";
import User from "../models/userModels.js";
// Unified auth middleware using your verifyToken
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token using your utility function
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // Attach full user object for later use
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({ success: false, message: "Server error in auth" });
  }
};

// Role-based middleware
export const organizerOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });

  if (["organizer", "admin"].includes(req.user.role)) {
    return next();
  }

  res.status(403).json({ message: "Access denied" });
};
