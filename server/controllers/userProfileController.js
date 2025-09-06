// import User from '../models/userModels.js';
// import Donation from '../models/donation.js';

// // Get current user profile
// export const getProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.id).select('-password');
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Update profile
// export const updateProfile = async (req, res) => {
//     try {
//         const { displayName,email, } = req.body;
//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         if (displayName) user.name = displayName;
//         if (email) user.email = email;

//         await user.save();
//         res.json({ message: "Profile updated", user });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get all campaigns by user
// export const getUserDonations = async (req, res) => {
//     try {
//         const donations = await Donation.find({ User: req.user.id });
//         res.json(donations);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Delete user account
// export const deleteAccount = async (req, res) => {
//     try {
//         await Donation.deleteMany({ user: req.user.id });
//         await User.findByIdAndDelete(req.user.id);
//         res.json({ message: "User account and campaigns deleted" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
// // Upload profile image to MongoDB
// export const uploadProfilePhoto = async (req, res) => {
//     try {
//         if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//         const user = await User.findById(req.user.id);
//         if (!user) return res.status(404).json({ message: "User not found" });

//         // Save image buffer and content type in MongoDB
//         user.profileImage={
//             data:req.file.buffer,
//             contentType:req.file.mimetype
//         }

//         await user.save();

//         res.json({ message: "Profile photo uploaded successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Endpoint to serve profile image
// export const getProfilePhoto = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user || !user.profileImage.data || !user.profileImage){
//              return res.status(404).json({ message: "No profile photo found" });
//         }
//         res.set('Content-Type', user.profileImage.contentType);
//         res.send(user.profileImage.data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };
import User from '../models/userModels.js';
import Donation from '../models/donation.js';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user || user.role !== 'user') return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { displayName, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'user') return res.status(404).json({ message: "User not found" });

        if (displayName) user.displayName = displayName;
        if (email) user.email = email;

        await user.save();
        res.json({ message: "Profile updated", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get user donations
export const getUserDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ user: req.user.id });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete user account
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'user') return res.status(404).json({ message: "User not found" });

        await Donation.deleteMany({ user: req.user.id });
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: "User account and donations deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Upload profile photo
export const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'user') return res.status(404).json({ message: "User not found" });

        user.profileImage = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };

        await user.save();
        res.json({ message: "Profile photo uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const getProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profileImage || !user.profileImage.data) {
            return res.status(404).json({ message: "No profile photo found" });
        }

        res.set('Content-Type', user.profileImage.contentType);
        res.send(user.profileImage.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


