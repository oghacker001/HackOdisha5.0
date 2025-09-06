import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        required: true
    },
    email: {
        type: String,
        required: function () { return !this.googleId; }, // Required if not signing up with Google
        unique: true,
        lowercase: true,
        sparse: true // Allow null values for email if googleId is present
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId && this.role !== "admin"; // Required if not Google and not admin
        }
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true // Allow null values for googleId if email is present
    },
    displayName: {
        type: String
    },
    adminKey: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    campaigns:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Campaign"
    }],
    donations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Donation"
    }],
    totalDonation:{
        type:Number,
        default:0
    },
    profileImage: { 
        data: Buffer, 
        contentType: String 
    },
});

const userModel = mongoose.models.User || mongoose.model('User', UserSchema);
export default userModel;