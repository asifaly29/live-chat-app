import jwt from "jsonwebtoken";
import dotenv from 'dotenv';


dotenv.config();


const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // ===== COOKIE CONFIGURATION FOR CROSS-SITE REQUESTS =====
  // CRITICAL: For Vercel → Railway communication, we MUST use:
  // - secure: true (HTTPS only)
  // - sameSite: "None" (allows cross-site cookies)
  // This works regardless of NODE_ENV because Railway always uses HTTPS
  
  const isLocalhost = process.env.PORT === "5000" || !process.env.PORT;
  
  console.log(`🍪 Cookie Config - Localhost: ${isLocalhost}`);
  
  res.cookie("jwt", token, {
    httpOnly: true, // Prevent JavaScript access (security)
    secure: true, // ALWAYS true because Railway uses HTTPS
    sameSite: isLocalhost ? "strict" : "None", // "None" for production (Vercel → Railway)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  
  console.log(`✅ JWT cookie set - sameSite: ${isLocalhost ? "strict" : "None"}, secure: true`);
};

export default generateToken;






