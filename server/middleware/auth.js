import { verifyToken } from "../utils/token.js";
import User from "../models/userModels.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });
    
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ success: false, message: "Invalid or expired token" });
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    
    // FIXED: Set both for consistency across controllers
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error in auth" });
  }
};

export const organizerOrAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (["organizer", "admin"].includes(req.user.role)) return next();
  res.status(403).json({ message: "Access denied" });
};

// FIXED: Added missing admin-only middleware
export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  if (req.user.role === "admin") return next();
  res.status(403).json({ message: "Admin access required" });
};