import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/**
 * Sign up a new user
 * Validates input, hashes password, generates JWT token
 */
export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		// ===== INPUT VALIDATION =====
		if (!fullName || !username || !password || !confirmPassword || !gender) {
			return res.status(400).json({ error: "All fields are required" });
		}

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters" });
		}

		if (!["male", "female"].includes(gender.toLowerCase())) {
			return res.status(400).json({ error: "Gender must be either 'male' or 'female'" });
		}

		// ===== CHECK IF USER ALREADY EXISTS =====
		const existingUser = await User.findOne({ username: username.toLowerCase() });

		if (existingUser) {
			return res.status(400).json({ error: "Username already exists" });
		}

		// ===== HASH PASSWORD =====
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// ===== NORMALIZE INPUT =====
		const normalizedUsername = username?.toLowerCase() || "";
		const normalizedGender = gender?.toLowerCase();

		// ===== AVATAR STYLE =====
		const avatarStyle =
			normalizedGender === "male"
				? "set1"
				: normalizedGender === "female"
				? "set4"
				: "set2";

		const seed = normalizedUsername || "guest";
		const defaultProfilePic = `https://robohash.org/${encodeURIComponent(seed)}?set=${avatarStyle}`;
		const profilePic = req.body.profilePic || defaultProfilePic;

		// ===== CREATE NEW USER =====
		const newUser = new User({
			fullName,
			username: normalizedUsername,
			password: hashedPassword,
			gender: normalizedGender,
			profilePic,
		});

		if (newUser) {
			// Generate JWT token and set cookie
			generateToken(newUser._id, res);

			// Save user to database
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.error("Error in signup controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Log in an existing user
 * Validates credentials, generates JWT token
 */
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// ===== INPUT VALIDATION =====
		if (!username || !password) {
			return res.status(400).json({ error: "Username and password are required" });
		}

		// ===== FIND USER =====
		const user = await User.findOne({ username: username.toLowerCase() });

		// ===== VALIDATE PASSWORD =====
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		// ===== GENERATE TOKEN =====
		generateToken(user._id, res);

		// ===== SEND RESPONSE =====
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});
	} catch (error) {
		console.error("Error in login controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

/**
 * Log out user
 * Clears JWT token by setting maxAge to 0
 */
export const logout = async (req, res) => {
	try {
		// ===== CLEAR JWT COOKIE WITH PROPER CROSS-SITE SETTINGS =====
		// Match the same cookie settings used in generateToken for proper deletion
		const isLocalhost = process.env.PORT === "5000" || !process.env.PORT;
		
		res.cookie("jwt", "", {
			maxAge: 0,
			httpOnly: true,
			secure: true, // ALWAYS true because Railway uses HTTPS
			sameSite: isLocalhost ? "strict" : "None", // "None" for production
		});

		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};