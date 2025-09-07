import Event from "../models/event.js";
import User from "../models/userModels.js";
import Comment from "../models/comment.js";

export const createEvent = async (req, res, next) => { /* ... */ };
export const updateEvent = async (req, res, next) => { /* ... */ };
export const deleteEvent = async (req, res, next) => { /* ... */ };

// ✅ Corrected: Only get events with "approved" status
export const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ status: "approved" }).populate("organizer", "displayName profilePhoto");
        res.success(events, "Events retrieved successfully");
    } catch (err) { next(err); }
};

export const getEventById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id).populate("organizer", "displayName profilePhoto");
        if (!event) return res.status(404).json({ message: "Event not found." });
        res.success(event, "Event retrieved successfully");
    } catch (err) { next(err); }
};
