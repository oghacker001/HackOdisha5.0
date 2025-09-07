import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    organization: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { 
        type: Date, 
        required: true, 
        validate: { 
            validator: function(v) { return v >= this.startDate; }, // FIXED: Proper function context
            message: 'End date must be after or on the start date.' 
        } 
    },
    goalAmount: { type: Number, required: true },
    collectedAmount: { type: Number, default: 0 },
    description: { type: String, required: true },
    imageName: { type: String },
    validation_doc: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    termsAccepted: { type: Boolean, required: true, validate: [ (v) => v === true, 'You must accept the terms and conditions.' ] },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;