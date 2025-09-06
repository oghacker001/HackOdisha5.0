import { verifyToken } from "../utils/token.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Get token either from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Attach user id to request object for later use
    req.userId = decoded.id;

    next(); // ✅ Move to the next middleware/route
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(500).json({ success: false, message: "Server error in auth" });
  }
};
