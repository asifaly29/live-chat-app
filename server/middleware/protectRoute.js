import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and attaches user data to request object
 */
const protectRoute = async (req, res, next) => {
	try {
		// Extract JWT token from cookies
		const token = req.cookies.jwt;

		// Check if token exists
		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No token provided" });
		}

		// Verify and decode token
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({ error: "Token expired - Please login again" });
			}
			return res.status(401).json({ error: "Unauthorized - Invalid token" });
		}

		// Check if decoded token has userId
		if (!decoded || !decoded.userId) {
			return res.status(401).json({ error: "Unauthorized - Invalid token payload" });
		}

		// Find user in database
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Attach user data to request object
		req.user = user;
		next();
	} catch (error) {
		console.error("Error in protectRoute middleware:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default protectRoute;    