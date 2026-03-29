import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();


const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ===== COOKIE CONFIGURATION FOR CROSS-SITE REQUESTS =====
  // In production (Vercel frontend + Railway backend): use sameSite: "None" with secure: true
  // In development: use sameSite: "strict" with secure: false
  // This ensures cookies are sent with cross-origin requests in production
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent JavaScript access (security)
    secure: process.env.NODE_ENV !== "development", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "None", // "None" required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export default generateToken;






