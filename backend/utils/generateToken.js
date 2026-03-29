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
  const isProduction = process.env.NODE_ENV !== "development";
  const sameSiteValue = process.env.NODE_ENV === "development" ? "strict" : "None";
  
  console.log(`🍪 Setting JWT cookie - NODE_ENV: ${process.env.NODE_ENV}, Secure: ${isProduction}, SameSite: ${sameSiteValue}`);
  
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent JavaScript access (security)
    secure: isProduction, // HTTPS only in production
    sameSite: sameSiteValue, // "None" required for cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  console.log(`✅ JWT cookie set successfully for user: ${userId}`);
};

export default generateToken;






