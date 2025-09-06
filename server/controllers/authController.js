import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import userModel from '../models/userModels.js';
import transporter from '../config/nodemailer.js';
import { generateToken } from '../utils/token.js';

// ======================== REGISTER ========================
export const Register = async (req, res) => {
    const { role, displayName, email, password, adminKey } = req.body;

    if (!role || !email || (!password && role !== 'admin')) {
        return res.json({ success: false, message: "Missing credentials" });
    }

    try {
        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        // Role-specific validations
        if (role === "organizer" && !displayName) {
            return res.json({ success: false, message: "Organizer must have a name" });
        }
        if (role === "admin") {
            if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
                return res.json({ success: false, message: "Admin must have a valid admin key." });
            }
        }

        // Hash password only for non-admins
        const hashedPassword = role !== 'admin' ? await bcrypt.hash(password, 10) : undefined;

        const userData = {
            role,
            email,
            password: hashedPassword,
        };

        if (role !== "admin") userData.displayName = displayName;

        const user = new userModel(userData);
        await user.save();

        // Generate JWT
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send welcome email only for non-admins
        if (role !== "admin") {
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Welcome to CrowdFund",
                text: `Welcome ${displayName}, thanks for joining! 🎉`
            };
            try {
                await transporter.sendMail(mailOptions);
                console.log("📧 Email sent successfully");
            } catch (error) {
                console.error("❌ Email send failed:", error);
            }
        }

        return res.status(201).json({
            success: true,
            role: user.role,
            user: {
                id: user._id,
                displayName: user.displayName || null,
                email: user.email,
            },
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ======================== LOGIN ========================
export const Login = async (req, res) => {
    const { email, password, adminKey } = req.body;

    if (!email) return res.json({ success: false, message: "E-mail is required" });

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid email" });

        // Role-based authentication
        if (user.role === "admin") {
            if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
                return res.json({ success: false, message: "Invalid admin key" });
            }
        } else {
            if (!password) return res.json({ success: false, message: "Password is required" });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.json({ success: false, message: "Invalid password" });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            role: user.role,
            user: {
                id: user._id,
                displayName: user.displayName || null,
                email: user.email
            }
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ======================== LOGOUT ========================
export const Logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ======================== GOOGLE LOGIN ========================
export const GoogleLogin = async (req, res) => {
    const { googleId, email, displayName, role } = req.body;

    if (!googleId || !email || !role) {
        return res.json({ success: false, message: "Missing Google authentication data" });
    }

    if (!["user", "organizer"].includes(role)) {
        return res.json({ success: false, message: "Invalid role for Google login" });
    }

    try {
        let user = await userModel.findOne({ $or: [{ googleId }, { email }] });
        if (!user) {
            user = new userModel({ googleId, email, displayName, role });
            await user.save();

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Welcome to CrowdFund",
                text: `Welcome ${displayName}, thanks for joining with Google! 🎉`,
            };
            try {
                await transporter.sendMail(mailOptions);
                console.log("📧 Google login welcome email sent successfully");
            } catch (error) {
                console.error("❌ Google login email send failed:", error.message);
            }
        } else {
            // Update googleId, displayName, role if changed
            if (!user.googleId) user.googleId = googleId;
            if (user.displayName !== displayName) user.displayName = displayName;
            if (user.role !== role) user.role = role;
            await user.save();
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            message: `Logged in as ${user.role}`,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Google login error:", error.message);
        return res.json({ success: false, message: error.message });
    }
};
