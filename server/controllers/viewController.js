import Event from "../models/event.js";
import User from "../models/userModels.js";
import Campaign from "../models/Campaign.js";

// @desc    Render the Organizer Dashboard page
// @route   GET /views/organizer/dashboard
// @access  Protected (Organizer)
export const renderOrganizerDashboard = async (req, res, next) => {
    try {
        const organizerId = req.userId;
        
        // Fetch the organizer's details
        const organizer = await User.findById(organizerId).select('-password');
        if (!organizer) {
            return res.status(404).render('error', { message: 'Organizer not found' });
        }
        
        // Fetch all campaigns for this organizer
        const campaigns = await Campaign.find({ organizer: organizerId });

        // Pass both the organizer and campaigns to the EJS template
        res.render("index", { organizer, campaigns });
    } catch (err) {
        next(err);
    }
};